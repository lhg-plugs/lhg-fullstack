# TEMPLATE.md：lhg-plugs 插件模板说明

> 本仓库（`lhg-plugs/lhg-fullstack`）是 lhg-plugs 组织后续约 100 个插件的**模板**。
> 新建插件时：复制本仓库目录结构，按下表"改哪几处"逐项修改，跑通 `smoke_test.py` 即可发布。

## 1. 哪些文件是模板（照抄结构，换内容）

| 文件/目录 | 模板属性 | 新建插件时改什么 |
|---|---|---|
| `.claude-plugin/plugin.json` | 结构模板 | `name`（kebab-case，如 `lhg-xxx`）、`displayName`、`description`、`keywords`、`version` 从 `1.0.0` 起 |
| `.claude-plugin/marketplace.json` | 结构模板 | `plugins[0].name`（与 plugin.json 的 `name` **必须一致**）、`description`；`source` 保持 `"./"`（本仓即市场） |
| `commands/*.md` | 结构模板 | 按新插件的用户旅程重写命令（建议保留 `audit` 式自查命令）；frontmatter 保留 `description` + `argument-hint` |
| `skills/<name>/SKILL.md` | 内容模板 | 按"何时使用→输入输出→分步方法论→反模式→自检与反馈→出品区"结构重写；frontmatter 只用 `name`/`description`/`license`/`compatibility`/`metadata`（平台中立）；正文**不许引用 Claude Code 专有工具名** |
| `agents/*.md` | 结构模板 | 按新插件的专家角色重写 system prompt；frontmatter 保留 `name`/`description`/`tools`/`model` |
| `hooks/hooks.json` | 结构模板 | 按新插件需要的硬门重写事件与脚本；**必须写明逃生方式**（环境变量开关），不许做成骚扰 |
| `hooks/*.py` | 结构模板 | 重写检查逻辑；保持"快速放行非目标事件、内部出错 fail-open、零第三方依赖"三原则 |
| `scripts/audit/*.py` | 结构模板 | 换成新领域的确定性规则；保持"规则注册表 + JSON/text 双输出 + exit code 语义" |
| `fixtures/*` | 结构模板 | 换成新领域的坏/好对照用例；坏用例的每个埋点要在 smoke_test 里断言命中 |
| `smoke_test.py` | 结构模板 | 改 `FE_BAD_MUST`/`BE_BAD_MUST` 为新规则 ID 集合；改数量口径；其余照用 |
| `README.md` | 结构模板 | 按 GEO 规范重写：H1 后紧跟答案块（一句话介绍 + 一键安装命令）；`## 出品` 前放"什么时候用 / 什么时候不用"FAQ；更新插件矩阵表格（追加一行）；顶部保留 About/topics 注释 |
| `ATTRIBUTION.md` | 结构模板 | 换成新插件的灵感来源（作者/许可/链接），保留"借鉴思路、实现与文案均为原创"声明 |
| `LICENSE` | 照抄 | 不变（MIT，版权人刘洪光） |

## 2. 哪些是规范（新建插件必须遵守）

1. **GEO 规范**：README 的 H1 标题后紧跟答案块（一句话介绍 + 一键安装命令），`## 出品` 区之前必须有"什么时候用 / 什么时候不用"FAQ。
2. **About 句式**：`<一句话功能> ｜ 一键安装：/plugin marketplace add lhg-plugs/<仓库名>`（推送后填到仓库 About 栏）。
3. **topics**：`claude-code, claude-plugin, agent-skills, fullstack, nextjs, supabase, ai-agents`（按插件领域替换后半部分，前三个保留）。
4. **出品区**：每个 skill 的 SKILL.md 末尾 + README 末尾保留「出品：刘洪光」区（含 https://github.com/lhg-skills）。
5. **自迭代**：每个 skill 含「自检与反馈」节（质检门 + 标准冒烟用例 + 一键提 issue 到本仓库）。
6. **平台中立**：`skills/` 下的 SKILL.md 正文不许出现 Claude Code 专有工具名（Task/Bash/Edit/PreToolUse 等），保证可移植到豆包/Workbuddy。
7. **红线**：不许复制任何第三方 skill/插件的原文案与代码；只借鉴思路，且必须在 ATTRIBUTION.md 声明。
8. **冒烟全绿**：发布前 `python3 smoke_test.py` 必须全绿（JSON 合法、frontmatter 完整、埋点全命中、hooks 行为正确）。

## 3. 发布清单

- [ ] 按上表改完所有模板文件
- [ ] `python3 smoke_test.py` 全绿
- [ ] 仓库 About 按句式填写
- [ ] topics 照打
- [ ] 推送到 `lhg-plugs/<新仓库名>`（公开）
- [ ] 在组织级 marketplace 索引仓追加一行（见组织规范）
- [ ] 回到本模板仓的 README「插件矩阵」追加一行（保持互链）

## 4. 版本号

- 首版 `1.0.0`；修 bug 升 patch，加命令/规则升 minor，重构目录结构升 major。
- `plugin.json` 的 `version` 是唯一版本源，`marketplace.json` 不重复声明。
