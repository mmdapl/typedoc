// Please DO NOT include machine generated translations here.
// If adding a new key, leave it commented out for a native speaker
// to update.

import localeUtils = require("../locale-utils.cjs");

export = localeUtils.buildIncompleteTranslation({
    loaded_multiple_times_0: "TypeDoc 已加载多次。这通常是由具有自己的 TypeDoc 安装的插件引起的。加载的路径为：\n{0}",
    unsupported_ts_version_0:
        "您正在使用不受支持的 TypeScript 版本运行！如果 TypeDoc 崩溃，这就是原因。TypeDoc 支持 {0}",
    no_compiler_options_set: "未设置编译器选项。这可能意味着 TypeDoc 没有找到你的 tsconfig.json。生成的文档可能为空",

    loaded_plugin_0: "已加载插件 {0}",

    solution_not_supported_in_watch_mode: "提供的 tsconfig 文件看起来像解决方案样式的 tsconfig，在监视模式下不受支持",
    strategy_not_supported_in_watch_mode: "对于监视模式，entryPointStrategy 必须设置为 resolve 或 expand",
    file_0_changed_restarting: "配置文件 {0} 已更改：需要重新启动……",
    file_0_changed_rebuilding: "文件 {0} 已更改：正在重新构建输出……",
    found_0_errors_and_1_warnings: "发现 {0} 个错误和 {1} 个警告",

    output_0_could_not_be_generated: "由于以上错误无法生成 {0} 输出",
    output_0_generated_at_1: "已生成 {0} 输出，位于 {1}",

    no_entry_points_for_packages: "没有为包模式提供入口点，无法生成文档",
    failed_to_find_packages: "找不到任何软件包，请确保您至少提供了一个包含 package.json 的目录作为入口点",
    nested_packages_unsupported_0: "位于 {0} 的项目已将 entryPointStrategy 设置为包，但不支持嵌套包",
    package_option_0_should_be_specified_at_root: "由 packageOptions 设置的选项 {0} 仅在根级别有效",
    previous_error_occurred_when_reading_options_for_0: "读取 {0} 处的包的选项时发生上一个错误",
    converting_project_at_0: "正在转换 {0} 处的项目",
    failed_to_convert_packages: "无法转换一个或多个包，结果将不会合并在一起",
    merging_converted_projects: "合并转换后的项目",

    no_entry_points_to_merge: "没有提供合并的入口点",
    entrypoint_did_not_match_files_0: "入口点 glob {0} 与任何文件均不匹配",
    failed_to_parse_json_0: "无法将 {0} 处的文件解析为 json",

    failed_to_read_0_when_processing_document_tag_in_1: "处理 {1} 中注释的 @document 标签时无法读取文件 {0}",
    failed_to_read_0_when_processing_project_document: "添加项目文档时无法读取文件 {0}",
    failed_to_read_0_when_processing_document_child_in_1: "处理 {1} 中的文档子项时无法读取文件 {0}",
    frontmatter_children_0_should_be_an_array_of_strings_or_object_with_string_values:
        "{0} 中的 Frontmatter 子项应为字符串数组或具有字符串值的对象",
    converting_union_as_interface:
        "在联合类型上使用 @interface 将丢弃联合所有分支上不存在的属性。TypeDoc 的输出可能无法准确描述您的源代码",
    converting_0_as_class_requires_value_declaration: "将 {0} 转换为类需要表示非类型值的声明",
    converting_0_as_class_without_construct_signatures: "{0} 正在转换为类，但没有任何构造签名",

    comment_for_0_should_not_contain_block_or_modifier_tags: "{0} 的注释不应包含任何块级标签或修饰符标签",

    symbol_0_has_multiple_declarations_with_comment: "{0} 有多个带注释的声明。将使用任意注释",
    comments_for_0_are_declared_at_1: "{0} 的注释声明于：\n{1}",

    // comments/parser.ts
    multiple_type_parameters_on_template_tag_unsupported:
        "TypeDoc 不支持在带有注释的单个 @template 标签中定义多个类型参数",
    failed_to_find_jsdoc_tag_for_name_0: "解析注释后无法找到 {0} 的 JSDoc 标签，请提交错误报告",
    relative_path_0_is_not_a_file_and_will_not_be_copied_to_output:
        "找不到相对路径 {0} 对应的文件，该文件不会被复制至输出目录",

    inline_inheritdoc_should_not_appear_in_block_tag_in_comment_at_0:
        "内联 @inheritDoc 标签不应出现在块级标签内，因为它不会在 {0} 处的注释中被处理。",
    at_most_one_remarks_tag_expected_in_comment_at_0:
        "注释中最多应有一个 @remarks 标签，忽略 {0} 处注释中除第一个标签之外的所有标签",
    at_most_one_returns_tag_expected_in_comment_at_0:
        "注释中最多应有一个 @returns 标签，忽略 {0} 处注释中除第一个标签之外的所有标签",
    at_most_one_inheritdoc_tag_expected_in_comment_at_0:
        "注释中最多应有一个 @inheritDoc 标签，忽略 {0} 处注释中除第一个标签之外的所有标签",
    content_in_summary_overwritten_by_inheritdoc_in_comment_at_0:
        "摘要部分的内容将被 {0} 处注释中的 @inheritDoc 标签覆盖",
    content_in_remarks_block_overwritten_by_inheritdoc_in_comment_at_0:
        "@remarks 块中的内容将被 {0} 处注释中的 @inheritDoc 标签覆盖",
    example_tag_literal_name: "示例标签的第一行将按原样作为示例名称，并且只能包含文本",
    inheritdoc_tag_properly_capitalized: "@inheritDoc 标签应正确大写",
    treating_unrecognized_tag_0_as_modifier: "将无法识别的标签 {0} 视为修饰标签",
    unmatched_closing_brace: "不匹配的右括号",
    unescaped_open_brace_without_inline_tag: "遇到未转义的无内联标签的开括号",
    unknown_block_tag_0: "遇到未知的块级标签 {0}",
    unknown_inline_tag_0: "遇到未知的内联标签 {0}",
    open_brace_within_inline_tag: "在内联标签中遇到左括号，这可能是一个错误",
    inline_tag_not_closed: "内联标签未关闭",

    // validation
    comment_for_0_links_to_1_not_included_in_docs_use_external_link_2:
        `{0} 注释中指向 “{1}” 的已解析的链接不会被包含在文档中。请将 {2} 导出或添加至 externalSymbolLinkMappings 选项以修复该警告`,
    failed_to_resolve_link_to_0_in_comment_for_1: "无法解析 {1} 注释中指向 “{0}” 的链接",
    failed_to_resolve_link_to_0_in_comment_for_1_may_have_meant_2:
        "无法解析 {1} 的注释中指向 “{0}” 的链接。您可能想要 “{2}”",
    failed_to_resolve_link_to_0_in_readme_for_1: "无法解析 {1} 的自述文件中指向 “{0}” 的链接",
    failed_to_resolve_link_to_0_in_readme_for_1_may_have_meant_2:
        "无法解析 {1} 的自述文件中指向 “{0}” 的链接。您可能想要 “{2}”",
    failed_to_resolve_link_to_0_in_document_1: "无法解析文档 {1} 中指向 “{0}” 的链接",
    failed_to_resolve_link_to_0_in_document_1_may_have_meant_2:
        "无法解析文档 {1} 中指向 “{0}” 的链接。您可能想要 “{2}”",
    type_0_defined_in_1_is_referenced_by_2_but_not_included_in_docs: "{0} 在 {1} 中定义，被 {2} 引用，但未包含在文档中",
    reflection_0_kind_1_defined_in_2_does_not_have_any_documentation: "{0} ({1})，在 {2} 中定义，没有任何文档",
    invalid_intentionally_not_documented_names_0:
        "以下的限定反射名称被设定为刻意无文档说明，但它们要么未在文档中被引用，要么已有文档说明：\n\t{0}",
    invalid_intentionally_not_exported_symbols_0:
        "以下符号被设定为刻意非导出，但它们要么未在文档中被引用，要么已为导出符号：\n{0}",
    reflection_0_has_unused_mergeModuleWith_tag: "{0} 中存在无法解析的 @mergeModuleWith 标签",
    reflection_0_links_to_1_with_text_2_but_resolved_to_3:
        "“{0}”中的链接“{2}”指向“{1}”，目标虽然存在但并没有直接的链接，因此将改为链接至“{3}”。",

    // conversion plugins
    not_all_search_category_boosts_used_0:
        "文档中并未使用 searchCategoryBoosts 中指定的所有类别。未使用的类别包括：\n{0}",
    not_all_search_group_boosts_used_0: "文档中并未使用 searchGroupBoosts 中指定的所有组。未使用的组为：\n{0}",
    comment_for_0_includes_categoryDescription_for_1_but_no_child_in_group:
        "{0} 的注释中包含了 “{1}” 的 @categoryDescription，但该类别中没有子项",
    comment_for_0_includes_groupDescription_for_1_but_no_child_in_group:
        "{0} 的注释中包含了 “{1}” 的 @groupDescription，但该分组中没有子项",
    comment_for_0_specifies_1_as_sort_strategy_but_only_2_is_valid:
        `{0} 的注释中指定的 “{1}” 的 @sortStrategy 无效，以下是有效的选项：\n\t{2}`,
    label_0_for_1_cannot_be_referenced:
        "无法使用声明引用来引用 {1} 的标签“{0}”。标签只能包含 A-Z、0-9 和 _，并且不能以数字开头",
    modifier_tag_0_is_mutually_exclusive_with_1_in_comment_for_2: "修饰符标签 {0} 与 {2} 注释中的 {1} 互斥",
    signature_0_has_unused_param_with_name_1: "签名 {0} 有一个名为“{1}”的 @param，但未被使用",
    declaration_reference_in_inheritdoc_for_0_not_fully_parsed:
        "@inheritDoc 中对 {0} 的声明引用未完全解析，可能会解析不正确",
    failed_to_find_0_to_inherit_comment_from_in_1: "在 {1} 的注释中找不到要继承的注释“{0}”",
    reflection_0_tried_to_copy_comment_from_1_but_source_had_no_comment:
        "{0} 尝试使用 @inheritDoc 从 {1} 复制注释，但源没有相关注释",
    inheritdoc_circular_inheritance_chain_0: "@inheritDoc 指定循环继承链：{0}",
    provided_readme_at_0_could_not_be_read: "提供的 README 路径无法读取 {0}",
    defaulting_project_name: "未指定 --name 选项，并且未找到 package.json。将项目名称默认为“Documentation”",
    disable_git_set_but_not_source_link_template:
        "已设置 disableGit，但未设置 sourceLinkTemplate，因此无法生成源代码链接。设置 sourceLinkTemplate 或 disableSources 以停用源代码跟踪",
    disable_git_set_and_git_revision_used:
        "disableGit 已设置，并且 sourceLinkTemplate 包含 {gitRevision}，由于未提供修订，因此将替换为空字符串",
    git_remote_0_not_valid: "提供的 git 远程“{0}”无效。源链接将失效",
    reflection_0_tried_to_merge_into_child_1: "反射 {0} 尝试使用 @mergeModuleWith 合并到其子项之一：{1}",

    include_0_in_1_specified_2_resolved_to_3_does_not_exist:
        "{1} 的注释中 {0} 标签指定了包含 “{2}”，解析为 “{3}”，该文件并不存在或并非文件。",
    include_0_in_1_specified_2_circular_include_3: "{1} 的注释中 {0} 标签指定了包含 “{2}”，导致了循环包含：\n\t{3}",
    include_0_tag_in_1_specified_2_file_3_region_4_region_not_found:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件找不到该区域。`,
    include_0_tag_in_1_region_2_region_not_supported: `{1} 中的 标签 {0} 指定了 “{2}”，但尚不支持对应的文件扩展名。`,
    include_0_tag_in_1_specified_2_file_3_region_4_region_close_not_found:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件中找不到该区域的结束注释。`,
    include_0_tag_in_1_specified_2_file_3_region_4_region_open_not_found:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件中找不到该区域的起始注释。`,
    include_0_tag_in_1_specified_2_file_3_region_4_region_close_found_multiple_times:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件中该区域的结束注释出现了多次。`,
    include_0_tag_in_1_specified_2_file_3_region_4_region_open_found_multiple_times:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件中该区域的起始注释出现了多次。`,
    include_0_tag_in_1_specified_2_file_3_region_4_region_found_multiple_times:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件中该区域出现了多次。`,
    include_0_tag_in_1_specified_2_file_3_region_4_region_empty:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中标记为 “{4}” 的区域，但在对应的文件中该区域不包含内容或仅包含空白字符。`,
    include_0_tag_in_1_specified_2_file_3_lines_4_invalid_range:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中的 {4} 行，但指定的行范围无效。`,
    include_0_tag_in_1_specified_2_file_3_lines_4_but_only_5_lines:
        `{1} 中的标签 {0} 指定 “{2}” 以包含文件 “{3}” 中的 {4} 行，但该文件只有 {5} 行。`,

    // output plugins
    custom_css_file_0_does_not_exist: "{0} 处的自定义 CSS 文件不存在",
    custom_js_file_0_does_not_exist: "{0} 处的自定义 JavaScript 文件不存在",
    unsupported_highlight_language_0_not_highlighted_in_comment_for_1:
        "{1} 的注释中使用了不支持的高亮语言 {0} ，因此该语言将不会被高亮",
    unloaded_language_0_not_highlighted_in_comment_for_1:
        "{1} 的注释中语言为 {0} 的代码块将不会被高亮，因为该语言未包含在 highlightLanguages 选项中",
    yaml_frontmatter_not_an_object: "YAML Frontmatter 应当为对象",

    // renderer
    could_not_write_0: "无法写入 {0}",
    could_not_empty_output_directory_0: "无法清空输出目录 {0}",
    could_not_create_output_directory_0: "无法创建输出目录 {0}",
    theme_0_is_not_defined_available_are_1: "主题“{0}”未定义。可用主题为：{1}",
    router_0_is_not_defined_available_are_1: `路由 “{0}” 未定义。可用的路由为：{1}`,
    reflection_0_links_to_1_but_anchor_does_not_exist_try_2: "{0} 链接至 {1}，但对应锚点不存在。你是否是指：\n\t{2}",

    // entry points
    no_entry_points_provided: "没有提供入口点，这可能是配置错误",
    unable_to_find_any_entry_points: "无法找到任何入口点。请参阅先前的警告",
    watch_does_not_support_packages_mode: "监视模式不支持“包”样式的入口点",
    watch_does_not_support_merge_mode: "监视模式不支持“合并”样式的入口点",
    entry_point_0_not_in_program: "入口点 {0} 未被 tsconfig 中的“files”或“include”选项引用",
    failed_to_resolve_0_to_ts_path: "无法将 package.json 中的入口点 {0} 解析至 TypeScript 源文件",
    use_expand_or_glob_for_files_in_dir: "如果要包含此目录中的文件，请设置 --entryPointStrategy 以展开或指定 glob",
    glob_0_did_not_match_any_files: "glob {0} 与任何文件均不匹配",
    entry_point_0_did_not_match_any_files_after_exclude: "应用排除模式后，glob {0} 没有匹配任何文件",
    entry_point_0_did_not_exist: "提供的入口点 {0} 不存在",
    entry_point_0_did_not_match_any_packages: "入口点 glob {0} 与任何包含 package.json 的目录不匹配",
    file_0_not_an_object: "文件 {0} 不是对象",

    // deserialization
    serialized_project_referenced_0_not_part_of_project: "序列化项目引用了反射 {0}，但它不是项目的一部分",
    saved_relative_path_0_resolved_from_1_does_not_exist: "序列化项目引用的 {0} 不存在或无法在 {1} 下找到",

    // options
    circular_reference_extends_0: "{0} 的“extends”字段出现循环引用",
    failed_resolve_0_to_file_in_1: "无法将 {0} 解析为 {1} 中的文件",

    glob_0_should_use_posix_slash:
        `该 glob “{0}” 中转义了不是特殊字符的字符。输入 TypeDoc 的 glob 可能不会使用 Windows 路径分隔符（\\），请尝试将其替换为 POSIX 路径分隔符（/）`,
    option_0_can_only_be_specified_by_config_file: "“{0}”选项只能通过配置文件指定",
    option_0_expected_a_value_but_none_provided: "--{0} 需要一个值，但没有给出任何参数",
    unknown_option_0_may_have_meant_1: "未知选项：{0}，你可能指的是：\n\t{1}",

    typedoc_key_in_0_ignored: "{0} 中的“typedoc”键已被旧包 entryPointStrategy 使用，将被忽略",
    typedoc_options_must_be_object_in_0: "无法解析 {0} 中的“typedocOptions”字段，请确保它存在且包含对象",
    tsconfig_file_0_does_not_exist: "tsconfig 文件 {0} 不存在",
    tsconfig_file_specifies_options_file:
        "tsconfig 文件中的“typedocOptions”指定要读取的选项文件，但该选项文件已被读取。这可能是配置错误",
    tsconfig_file_specifies_tsconfig_file: "tsconfig 文件中的“typedocOptions”可能未指定要读取的 tsconfig 文件",
    tags_0_defined_in_typedoc_json_overwritten_by_tsdoc_json: "typedoc.json 中定义的 {0} 将被 tsdoc.json 中的配置覆盖",
    failed_read_tsdoc_json_0: "无法读取位于 {0} 的 tsdoc.json 文件",
    invalid_tsdoc_json_0: "文件 {0} 不是有效的 tsdoc.json 文件",

    options_file_0_does_not_exist: "选项文件 {0} 不存在",
    failed_read_options_file_0: "无法解析 {0}，请确保其存在并导出对象",

    // plugins
    invalid_plugin_0_missing_load_function: "插件 {0} 中的结构无效，未找到加载函数",
    plugin_0_could_not_be_loaded: "无法加载插件 {0}",

    // option declarations help
    help_options: "指定应加载的 json 选项文件。如果未指定，TypeDoc 将在当前目录中查找“typedoc.json”",
    help_tsconfig: "指定应加载的 TypeScript 配置文件。如果未指定，TypeDoc 将在当前目录中查找“tsconfig.json”",
    help_compilerOptions: "有选择地覆盖 TypeDoc 使用的 TypeScript 编译器选项",
    help_lang: "设置生成和 TypeDoc 消息中使用的语言",
    help_locales: "为指定语言环境添加翻译。此选项主要用作在等待官方语言环境支持添加到 TypeDoc 时的权宜之计",
    help_packageOptions: "当 entryPointStrategy 设置为包时，设置将在每个包中设置的选项",

    help_entryPoints: "文档的入口点",
    help_entryPointStrategy: "将入口点转换为文档模块所采用的策略",
    help_alwaysCreateEntryPointModule: "设置后，TypeDoc 将始终为入口点创建一个“模块”，即使只提供了一个",
    help_projectDocuments: "应作为子项添加到生成文档根目录中的文档。支持使用 glob 匹配多个文件",
    help_exclude: "定义在扩展指定为入口点的目录时要排除的模式",
    help_externalPattern: "定义应被视为外部的文件的模式",
    help_excludeExternals: "防止记录外部解析的符号",
    help_excludeNotDocumented: "防止未明确记录的符号出现在结果中",
    help_excludeNotDocumentedKinds: "指定可以通过 excludeNotDocumented 删除的反射类型",
    help_excludeInternal: "防止标有 @internal 的符号被记录",
    help_excludeCategories: "从文档中排除此类别中的符号",
    help_excludePrivate: "忽略私有变量和方法，默认为 true。",
    help_excludeProtected: "忽略受保护的变量和方法",
    help_excludeReferences: "如果一个符号被导出多次，则忽略除第一次导出之外的所有导出",
    help_externalSymbolLinkMappings: "为文档中未包含的符号定义自定义链接",
    help_out: "指定默认类型输出的文档写入的位置。插件可能会改变默认的输出类型。",
    help_html: "指定 HTML 文档写入的位置",
    help_json: "指定描述项目的 JSON 文件写入的位置和文件名",
    help_pretty: "指定输出 JSON 是否应使用制表符进行格式化",
    help_emit: "指定 TypeDoc 应发出的内容，“docs”、“both”或“none”",
    help_theme: "指定用于呈现文档的主题名称",
    help_router: "指定需要使用路由的名称以决定文档中文件的命名方式",
    help_lightHighlightTheme: "指定浅色模式下的代码高亮主题",
    help_darkHighlightTheme: "指定暗黑模式下的代码高亮主题",
    help_highlightLanguages: "指定渲染时将加载的代码高亮语言",
    help_ignoredHighlightLanguages: "指定哪些语言将被视为支持的代码高亮语言，但不会在运行时被语法高亮",
    help_typePrintWidth: "渲染类型时触发自动换行的代码宽度",
    help_customCss: "要导入主题的自定义 CSS 文件的路径",
    help_customJs: "要导入的自定义 JS 文件的路径",
    help_markdownItOptions: "指定传递给 markdown-it（TypeDoc 使用的 Markdown 解析器）的选项",
    help_markdownItLoader: "指定加载 markdown-it 实例时要调用的回调。将传递 TypeDoc 将使用的解析器实例",
    help_maxTypeConversionDepth: "设置要转换类型的最大深度",
    help_name: "设置将在模板标题中使用的项目名称",
    help_includeVersion: "将软件包版本添加到项目名称中",
    help_disableSources: "记录反射时禁用设置反射源",
    help_sourceLinkTemplate:
        "指定生成源 URL 时要使用的链接模板。如果未设置，将使用 git remote 自动创建。支持 {path}、{line}、{gitRevision} 占位符",
    help_gitRevision:
        "使用指定修订版本而不是最新修订版本来链接到 GitHub/Bitbucket 源文件。如果设置了 disableSources，则无效",
    help_gitRemote: "使用指定的远程链接到 GitHub/Bitbucket 源文件。如果设置了 disableGit 或 disableSources，则无效",
    help_disableGit:
        "假设所有内容都可以通过 sourceLinkTemplate 进行链接，如果启用此功能，则必须设置 sourceLinkTemplate。{path} 将以 basePath 为根",
    help_basePath: "指定显示文件路径时使用的基本路径",
    help_excludeTags: "从文档注释中删除列出的块级/修饰符标签",
    help_notRenderedTags: "保留在文档注释中但在创建输出时不渲染的标签",
    help_cascadedModifierTags: "需要从父反射复制至所有子反射的修饰符标签",
    help_readme: "应显示在索引页上的自述文件路径。传递“none”以禁用索引页并在全局页上启动文档",
    help_cname: "设置 CNAME 文件文本，这对于 GitHub Pages 上的自定义域很有用",
    help_favicon: "作为站点图标包含的 favicon 的路径",
    help_sourceLinkExternal: "指定哪些源代码链接应被视为外部链接，并在新选项卡中打开",
    help_markdownLinkExternal: "指定注释与 Markdown 文件中哪些 http[s]:// 链接应被视为外部链接，并在新选项卡中打开",
    help_githubPages: "生成 .nojekyll 文件以防止 GitHub Pages 中出现 404 错误。默认为“true”",
    help_hostedBaseUrl:
        "指定用于在我们的输出文件夹和规范链接中生成 sitemap.xml 的基本 URL。如果未指定，则不会生成站点地图",
    help_useHostedBaseUrlForAbsoluteLinks: "如果设置，TypeDoc 将使用 hostingBaseUrl 选项生成到您网站页面的绝对链接",
    help_hideGenerator: "不要打印页面末尾的 TypeDoc 链接",
    help_customFooterHtml: "TypeDoc 链接后的自定义页脚",
    help_customFooterHtmlDisableWrapper: "如果设置，则禁用 customFooterHtml 的包装元素",
    help_cacheBust: "在静态资产链接中包含生成时间",
    help_searchInComments: "如果设置，搜索索引还将包括注释。这将大大增加搜索索引的大小",
    help_searchInDocuments: "如果设置，搜索索引还将包含文档。这将大大增加搜索索引的大小",
    help_cleanOutputDir: "如果设置，TypeDoc 将在写入输出之前删除输出目录",
    help_titleLink: "设置页眉中的标题指向的链接。默认为文档主页",
    help_navigationLinks: "定义要包含在标题中的链接",
    help_sidebarLinks: "定义要包含在侧边栏中的链接",
    help_navigationLeaves: "导航树中不应扩展的分支",
    help_headings: "确定标题是否需要被渲染",
    help_sluggerConfiguration: "确定渲染的 HTML 中锚点的确定方式",
    help_navigation: "确定导航侧边栏的组织方式",
    help_includeHierarchySummary: "如果设置，反射的层级一览将被渲染至概述页面。默认为 `true`",
    help_visibilityFilters: "根据修饰符标签指定内置过滤器和附加过滤器的默认可见性",
    help_searchCategoryBoosts: "配置搜索以提高所选类别的相关性",
    help_searchGroupBoosts: "配置搜索以增强所选种类（例如“类别”）的相关性",
    help_useFirstParagraphOfCommentAsSummary:
        "如果设置，且没有指定 @summary 标签，TypeDoc 会使用注释的第一行作为在模块/命名空间一览里的概述",
    help_jsDocCompatibility: "设置注释解析的兼容性选项，以增加与 JSDoc 注释的相似度",
    help_suppressCommentWarningsInDeclarationFiles: "阻止 .d.ts 文件的注释中因为存在未指定的标签而弹出的警告。",
    help_commentStyle: "确定 TypeDoc 如何搜索注释",
    help_useTsLinkResolution: "使用 TypeScript 的链接解析来确定 @link 标签指向的位置。这仅适用于 JSDoc 样式注释",
    help_preserveLinkText: "如果设置，不带链接文本的 @link 标签将使用文本内容作为链接。如果未设置，将使用目标反射名称",
    help_blockTags: "TypeDoc 在解析注释时应该识别的块级标签",
    help_inlineTags: "TypeDoc 在解析注释时应该识别的内联标签",
    help_modifierTags: "TypeDoc 在解析注释时应该识别的修饰符标签",
    help_categorizeByGroup: "指定是否在组级别进行分类",
    help_groupReferencesByType: "如果设置，引用将按照它们的类型进行分类，而非直接分在“引用”类型中",
    help_defaultCategory: "为没有类别的反射指定默认类别",
    help_categoryOrder: "指定类别出现的顺序。* 表示不在列表中的类别的相对顺序",
    help_groupOrder: "指定组的显示顺序。* 表示不在列表中的组的相对顺序",
    help_sort: "指定记录值的排序策略",
    help_sortEntryPoints: "如果设置，入口点将遵循与其他反射相同的排序规则",
    help_kindSortOrder: "当指定“种类”时指定反射的排序顺序",
    help_watch: "监视文件的变化并在发生更改时重建文档",
    help_preserveWatchOutput: "如果设置，TypeDoc 将不会在编译运行之间清除屏幕",
    help_skipErrorChecking: "在生成文档之前不要运行 TypeScript 的类型检查",
    help_help: "打印此消息",
    help_version: "打印 TypeDoc 的版本",
    help_showConfig: "打印解析后的配置并退出",
    help_plugin: "指定应加载的 npm 插件。省略则加载所有已安装的插件",
    help_logLevel: "指定应使用什么级别的日志记录",
    help_treatWarningsAsErrors: "如果设置，所有警告都将被视为错误",
    help_treatValidationWarningsAsErrors:
        "如果设置，验证期间发出的警告将被视为错误。此选项不能用于禁用验证警告的 treatWarningsAsErrors",
    help_intentionallyNotExported: "不会因为“引用但并未导出”而产生警告的符号列表",
    help_requiredToBeDocumented: "需要有文档说明的反射类型列表",
    help_packagesRequiringDocumentation: "需要有文档说明的包的列表",
    help_intentionallyNotDocumented: "不会因为无文档说明而产生警告的完整反射名称列表",
    help_validation: "指定 TypeDoc 应对生成的文档执行哪些验证步骤",

    // ==================================================================
    // Option validation
    // ==================================================================
    unknown_option_0_you_may_have_meant_1: "未知选项“{0}” 你可能指的是：\n{1}",
    option_0_must_be_between_1_and_2: "{0} 必须介于 {1} 和 {2} 之间",
    option_0_must_be_equal_to_or_greater_than_1: "{0} 必须等于或大于 {1}",
    option_0_must_be_less_than_or_equal_to_1: "{0} 必须小于或等于 {1}",
    option_0_must_be_one_of_1: "{0} 必须是 {1} 之一",
    flag_0_is_not_valid_for_1_expected_2: "标志“{0}”对 {1} 无效，应为 {2} 之一",
    expected_object_with_flag_values_for_0: "预期为一个带有标志值为 {0} 或 true/false 的对象",
    flag_values_for_0_must_be_booleans: "{0} 的标志值必须是布尔值",
    locales_must_be_an_object: "'locales' 选项必须设置为类似于以下对象：{ en: { theme_implements: \"Implements\" }}",
    exclude_not_documented_specified_0_valid_values_are_1:
        "excludeNotDocumentedKinds 只能指定已知值，并且提供了无效值 ({0})。有效类型为：\n{1}",
    external_symbol_link_mappings_must_be_object:
        "externalSymbolLinkMappings 必须是 Record<package name, Record<symbol name, link>>",
    highlight_theme_0_must_be_one_of_1: "{0} 必须是下列之一：{1}",
    highlightLanguages_contains_invalid_languages_0:
        "highlightLanguages 包含无效语言：{0}，运行 typedoc --help 获取受支持语言的列表",
    hostedBaseUrl_must_start_with_http: "hostingBaseUrl 必须以 http:// 或 https:// 开头",
    useHostedBaseUrlForAbsoluteLinks_requires_hostedBaseUrl:
        "useHostedBaseUrlForAbsoluteLinks 选项要求设置 hostingBaseUrl",
    favicon_must_have_one_of_the_following_extensions_0: "favicon 的后缀名必须是下列之一：{0}",
    option_0_must_be_an_object: "“{0}”选项必须是非数组对象",
    option_0_must_be_an_array_of_string: "“{0}”选项必须是字符串数组",
    option_0_must_be_an_array_of_string_or_functions: "“{0}”选项必须是由字符串或函数构成的数组",
    option_0_must_be_a_function: "‘{0}’ 选项必须是一个函数",
    option_0_must_be_object_with_urls: "{0} 必须是具有字符串标签作为键和 URL 值的对象",
    visibility_filters_only_include_0: "visibilityFilters 只能包含以下非@键：{0}",
    visibility_filters_must_be_booleans: "visibilityFilters 的所有值都必须是布尔值",
    option_0_values_must_be_numbers: "{0} 的所有值都必须是数字",
    option_0_values_must_be_array_of_tags: "{0} 必须是有效标签名称的数组",
    option_0_specified_1_but_only_2_is_valid: "{0} 只能指定已知值，并且提供了无效值 ({1})。有效的排序策略为：\n{2}",
    option_outputs_must_be_array:
        "“outputs” 选项必须为一个数组，其成员均为 { name: string, path: string, options?: TypeDocOptions }。",
    specified_output_0_has_not_been_defined: "指定的输出类型 {0} 未被定义。",

    // https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
    alert_note: "注意",
    alert_tip: "提示",
    alert_important: "重要",
    alert_warning: "警告",
    alert_caution: "小心",

    // ReflectionKind singular translations
    kind_project: "项目",
    kind_module: "模块",
    kind_namespace: "命名空间",
    kind_enum: "枚举",
    kind_enum_member: "枚举成员",
    kind_variable: "变量",
    kind_function: "函数",
    kind_class: "类",
    kind_interface: "接口",
    kind_constructor: "构造函数",
    kind_property: "属性",
    kind_method: "方法",
    kind_call_signature: "调用签名",
    kind_index_signature: "索引签名",
    kind_constructor_signature: "构造函数签名",
    kind_parameter: "参数",
    kind_type_literal: "类型字面量",
    kind_type_parameter: "类型参数",
    kind_accessor: "访问器",
    kind_get_signature: "Getter 签名",
    kind_set_signature: "Setter 签名",
    kind_type_alias: "类型别名",
    kind_reference: "参考",
    kind_document: "文档",

    // ReflectionKind plural translations
    kind_plural_project: "项目",
    kind_plural_module: "模块",
    kind_plural_namespace: "命名空间",
    kind_plural_enum: "枚举",
    kind_plural_enum_member: "枚举成员",
    kind_plural_variable: "变量",
    kind_plural_function: "函数",
    kind_plural_class: "类",
    kind_plural_interface: "接口",
    kind_plural_constructor: "构造函数",
    kind_plural_property: "属性",
    kind_plural_method: "方法",
    kind_plural_call_signature: "调用签名",
    kind_plural_index_signature: "索引签名",
    kind_plural_constructor_signature: "构造函数签名",
    kind_plural_parameter: "参数",
    kind_plural_type_literal: "类型字面量",
    kind_plural_type_parameter: "类型参数",
    kind_plural_accessor: "访问器",
    kind_plural_get_signature: "Getter 签名",
    kind_plural_set_signature: "Setter 签名",
    kind_plural_type_alias: "类型别名",
    kind_plural_reference: "参考",
    kind_plural_document: "文档",

    // ReflectionFlag translations
    flag_private: "私有",
    flag_protected: "受保护",
    flag_public: "公开",
    flag_static: "静态",
    flag_external: "外部",
    flag_optional: "可选",
    flag_rest: "动态参数",
    flag_abstract: "抽象",
    flag_const: "常量",
    flag_readonly: "只读",
    flag_inherited: "继承",

    // ==================================================================
    // Strings that show up in the default theme
    // ==================================================================
    // Page headings/labels
    theme_implements: "实现",
    theme_indexable: "可索引",
    theme_type_declaration: "类型声明",
    theme_index: "索引",
    theme_hierarchy: "层级",
    theme_hierarchy_summary: "层级一览",
    theme_hierarchy_view_summary: "查看层级一览",
    theme_implemented_by: "实现于",
    theme_defined_in: "定义于",
    theme_implementation_of: "实现了",
    theme_inherited_from: "继承自",
    theme_overrides: "重写了",
    theme_returns: "返回",
    theme_generated_using_typedoc: "使用 TypeDoc 生成", // If this includes "TypeDoc", theme will insert a link at that location.
    // Search
    theme_preparing_search_index: "正在准备搜索索引...",
    // Left nav bar
    theme_loading: "加载中……",
    // Right nav bar
    theme_settings: "显示设置",
    theme_member_visibility: "成员可见性",
    theme_theme: "配色",
    theme_os: "自动",
    theme_light: "浅色",
    theme_dark: "深色",
    theme_on_this_page: "目录",

    // aria-label
    theme_search: "搜索",
    theme_menu: "菜单",
    theme_permalink: "永久链接",
    theme_folder: "文件夹",

    // Used by the frontend JS
    // For the English translations only, these should also be added to
    // src/lib/output/themes/default/assets/typedoc/Application.ts
    // Also uses theme_folder and singular kinds
    theme_copy: "复制",
    theme_copied: "已复制！",
    theme_normally_hidden: "由于您的过滤器设置，该成员已被隐藏。",
    theme_hierarchy_expand: "展开",
    theme_hierarchy_collapse: "折叠",
    theme_search_index_not_available: "搜索索引不可用",
    theme_search_no_results_found_for_0: "找不到包含 {0} 的结果",
    theme_search_placeholder: "搜索文档",

    // Block tags
    tag_defaultValue: "默认值",
    tag_deprecated: "已被弃用",
    tag_example: "示例",
    tag_param: "参数",
    tag_privateRemarks: "私有备注",
    tag_remarks: "备注",
    tag_returns: "返回",
    tag_see: "参阅",
    tag_throws: "抛出",
    tag_typeParam: "类型参数",
    tag_author: "作者",
    tag_callback: "回调",
    tag_category: "类别",
    tag_categoryDescription: "类别描述",
    tag_default: "默认值",
    tag_document: "文档",
    tag_extends: "继承自",
    tag_augments: "继承自",
    tag_yields: "生成",
    tag_group: "分组",
    tag_groupDescription: "分组描述",
    tag_import: "导入",
    tag_inheritDoc: "继承文档",
    tag_jsx: "JSX",
    tag_license: "许可协议",
    tag_module: "模块",
    tag_mergeModuleWith: "合并模块至",
    tag_prop: "属性",
    tag_property: "属性",
    tag_return: "返回",
    tag_satisfies: "满足",
    tag_since: "添加于",
    tag_sortStrategy: "排序策略",
    tag_template: "类型参数",
    tag_type: "类型",
    tag_typedef: "类型定义",
    tag_summary: "概述",
    tag_preventInline: "取消内联",
    tag_inlineType: "内联类型",
    tag_preventExpand: "取消扩展",
    tag_expandType: "扩展类型",

    // Inline tags
    tag_link: "链接",
    tag_label: "标记",
    tag_linkcode: "链接",
    tag_linkplain: "链接",
    tag_include: "包含",
    tag_includeCode: "包含",

    // Modifier tags
    tag_alpha: "alpha",
    tag_beta: "beta",
    tag_eventProperty: "事件属性",
    tag_experimental: "实验性",
    tag_internal: "内部成员",
    tag_override: "重写",
    tag_packageDocumentation: "包文档",
    tag_public: "公共成员",
    tag_readonly: "只读",
    tag_sealed: "无法继承",
    tag_virtual: "虚函数",
    tag_abstract: "抽象类",
    tag_class: "类",
    tag_disableGroups: "禁用分组",
    tag_enum: "枚举",
    tag_event: "事件",
    tag_expand: "展开",
    tag_hidden: "隐藏",
    tag_hideCategories: "在类别中隐藏",
    tag_hideconstructor: "隐藏构造器",
    tag_hideGroups: "在分组中隐藏",
    tag_ignore: "隐藏",
    tag_inline: "内联",
    tag_interface: "接口",
    tag_namespace: "命名空间",
    tag_function: "函数",
    tag_overload: "重载",
    tag_private: "私有成员",
    tag_protected: "受保护成员",
    tag_showCategories: "在类别中显示",
    tag_showGroups: "在分组中显示",
    tag_useDeclaredType: "使用声明类型",
    tag_primaryExport: "主要导出",
});
