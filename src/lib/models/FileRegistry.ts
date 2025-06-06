import type { Deserializer, JSONOutput, Serializer } from "#serialization";
import type { ProjectReflection, Reflection } from "./index.js";
import type { ReflectionId } from "./Reflection.js";
import { type NormalizedPath, NormalizedPathUtils } from "#utils";

export type FileId = number & { __mediaIdBrand: never };

export class FileRegistry {
    protected nextId = 1;

    // The combination of these two make up the registry
    protected mediaToReflection = new Map<FileId, ReflectionId>();
    protected mediaToPath = new Map<FileId, NormalizedPath>();

    protected reflectionToPath = new Map<ReflectionId, NormalizedPath>();
    protected pathToMedia = new Map<NormalizedPath, FileId>();

    // Lazily created as we get names for rendering
    protected names = new Map<FileId, string>();
    protected nameUsage = new Map<string, number>();

    registerAbsolute(absolute: NormalizedPath): {
        target: FileId;
        anchor: string | undefined;
    } {
        const anchorIndex = absolute.indexOf("#");
        let anchor: string | undefined = undefined;
        if (anchorIndex !== -1) {
            anchor = absolute.substring(anchorIndex + 1);
            absolute = absolute.substring(0, anchorIndex) as NormalizedPath;
        }

        const existing = this.pathToMedia.get(absolute);
        if (existing) {
            return { target: existing, anchor };
        }

        this.mediaToPath.set(this.nextId as FileId, absolute);
        this.pathToMedia.set(absolute, this.nextId as FileId);

        return { target: this.nextId++ as FileId, anchor };
    }

    /**
     * Registers the specified path as the canonical file for this reflection
     */
    registerReflection(absolute: NormalizedPath, reflection: Reflection) {
        const { target } = this.registerAbsolute(absolute);
        this.reflectionToPath.set(reflection.id, absolute);
        this.mediaToReflection.set(target, reflection.id);
    }

    /**
     * Registers the specified path as a path which should be resolved to the specified
     * reflection. A reflection *may* be associated with multiple paths.
     */
    registerReflectionPath(absolute: NormalizedPath, reflection: Reflection) {
        const { target } = this.registerAbsolute(absolute);
        this.mediaToReflection.set(target, reflection.id);
    }

    getReflectionPath(reflection: Reflection): string | undefined {
        return this.reflectionToPath.get(reflection.id);
    }

    register(
        sourcePath: NormalizedPath,
        relativePath: NormalizedPath,
    ): { target: FileId; anchor: string | undefined } | undefined {
        return this.registerAbsolute(
            NormalizedPathUtils.resolve(NormalizedPathUtils.dirname(sourcePath), relativePath),
        );
    }

    removeReflection(reflection: Reflection): void {
        const absolute = this.reflectionToPath.get(reflection.id);
        if (absolute) {
            const media = this.pathToMedia.get(absolute)!;
            this.mediaToReflection.delete(media);
        }
    }

    resolve(
        id: FileId,
        project: ProjectReflection,
    ): string | Reflection | undefined {
        const reflId = this.mediaToReflection.get(id);
        if (reflId) {
            return project.getReflectionById(reflId);
        }
        return this.mediaToPath.get(id);
    }

    resolvePath(id: FileId): string | undefined {
        return this.mediaToPath.get(id);
    }

    getName(id: FileId): string | undefined {
        const absolute = this.mediaToPath.get(id);
        if (!absolute) return;

        if (this.names.has(id)) {
            return this.names.get(id);
        }

        const file = NormalizedPathUtils.basename(absolute);
        if (!this.nameUsage.has(file)) {
            this.nameUsage.set(file, 1);
            this.names.set(id, file);
        } else {
            const { name, ext } = NormalizedPathUtils.splitFilename(file);
            let counter = this.nameUsage.get(file)!;
            while (this.nameUsage.has(`${name}-${counter}${ext}`)) {
                ++counter;
            }
            this.nameUsage.set(file, counter + 1);
            this.nameUsage.set(`${name}-${counter}${ext}`, counter + 1);
            this.names.set(id, `${name}-${counter}${ext}`);
        }

        return this.names.get(id);
    }

    getNameToAbsoluteMap(): ReadonlyMap<string, string> {
        const result = new Map<string, string>();
        for (const [id, name] of this.names.entries()) {
            result.set(name, this.mediaToPath.get(id)!);
        }
        return result;
    }

    toObject(ser: Serializer): JSONOutput.FileRegistry {
        const result: JSONOutput.FileRegistry = {
            entries: {},
            reflections: {},
        };

        for (const [key, val] of this.mediaToPath.entries()) {
            result.entries[key] = NormalizedPathUtils.relative(ser.projectRoot, val);
        }
        for (const [key, val] of this.mediaToReflection.entries()) {
            // A registry may be shared by multiple projects. When serializing,
            // only save reflection mapping for reflections in the serialized project.
            if (ser.project.getReflectionById(val)) {
                result.reflections[key] = val;
            }
        }

        return result;
    }

    /**
     * Revive a file registry from disc.
     * Note that in the packages context this may be called multiple times on
     * a single object, and should merge in files from the other registries.
     */
    fromObject(de: Deserializer, obj: JSONOutput.FileRegistry): void {
        for (const [fileId, path] of Object.entries(obj.entries)) {
            const absolute = NormalizedPathUtils.resolve(de.projectRoot, path);
            de.oldFileIdToNewFileId[+fileId as FileId] = this.registerAbsolute(absolute).target;
        }

        de.defer((project) => {
            for (const [fileId, reflId] of Object.entries(obj.reflections)) {
                const refl = project.getReflectionById(
                    de.oldIdToNewId[reflId]!,
                );
                if (refl) {
                    this.mediaToReflection.set(
                        de.oldFileIdToNewFileId[+fileId as FileId]!,
                        refl.id,
                    );
                }
            }
        });
    }
}
