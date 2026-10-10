<!-- About 简介（推送后填写到仓库 About 栏）：
小白一句话生成高质量全栈应用的 Claude Code 插件 ｜ 一键安装：/plugin marketplace add lhg-plugs/lhg-fullstack
-->
<!-- topics（推送后打）：claude-code, claude-plugin, agent-skills, fullstack, nextjs, supabase, ai-agents -->

# lhg-fullstack：小白一句话 → 高质量全栈应用

> **一句话介绍**：给 AI 编程助手装上"全栈开发组合拳"——需求澄清、架构规划、前后端并行构建、62 条确定性规则自查、发布门禁，小白一句话也能做出又快又好又惊艳的全栈应用。
>
> **一键安装**：在 Claude Code 里运行
> ```
> /plugin marketplace add lhg-plugs/lhg-fullstack
> /plugin install lhg-fullstack@lhg-plugs
> ```

## 它是什么

`lhg-fullstack` 是一个 Claude Code 插件（plugin 为主、skill 为辅）：

- **5 个命令**（小白入口）：`new` 一句话生成全栈应用，`frontend` / `backend` 单做前后端，`audit` 前后端体检，`ship` 发布门禁
- **5 个平台中立 skill**（方法论，可移植到豆包/Workbuddy 等 agent 平台）：需求规划、前端 taste、后端 API/数据库规范、自查流程、项目记忆
- **3 个专家 agent**：前端构建、后端构建、独立审计
- **2 个硬门 hooks**：commit 前审计拦截、无测试的生产代码警告（均可一键豁免）
- **62 条确定性自查规则**：纯 Python、零第三方依赖，5 秒出结果

默认技术栈：Next.js + Tailwind（前端）、Next API Routes + Supabase/Postgres（后端）。

## 5 个命令用法

| 命令 | 作用 | 示例 |
|---|---|---|
| `/lhg-fullstack:new` | 一句话 → 完整全栈应用（澄清→规划→并行构建→自查→交付） | `/lhg-fullstack:new "做个小区团购接龙"` |
| `/lhg-fullstack:frontend` | 只做前端（taste 规则 + 移动端优先 + 自查） | `/lhg-fullstack:frontend "落地页 hero 区"` |
| `/lhg-fullstack:backend` | 只做后端（先定 API 契约，再实现） | `/lhg-fullstack:backend "订单创建接口"` |
| `/lhg-fullstack:audit` | 前后端体检（脚本 + 人工评审清单） | `/lhg-fullstack:audit` |
| `/lhg-fullstack:ship` | 发布门禁（审计/测试/上线清单/内容终审） | `/lhg-fullstack:ship` |

## 质量分档

- **默认 = 极速档**：流程完整、评审轮次少，确定性审计必跑。速度快、token 省，适合 MVP 与演示。
- **`--quality` = 品质档**：在 `new` / `frontend` / `backend` 后加 `--quality`，增加 taste 深评审、独立审计复查、多轮打磨。**诚实说明**：品质档 token 消耗约为极速档的数倍，请确认接受再使用。

## 自查说明

自查 = 确定性脚本（机器）+ 人工评审清单（人）：

1. 先跑 `scripts/audit/` 下的两个脚本（前端 35 条、后端 27 条规则），零 LLM 成本；
2. 发现分三级：**blocker**（必须修，commit 前 hook 会拦截）、**warning**（修或写豁免理由）、**nit**（顺手修）；
3. 再按 `lhg-fs-audit` skill 的评审清单过一遍脚本抓不到的（文案真实性、越权、幂等实测）。

blocker 清零才算做完；为清零改规则算作弊，不许。

## 目录结构

```
lhg-fullstack/
├── .claude-plugin/          # plugin.json（插件清单）+ marketplace.json（本仓即市场）
├── commands/                # 5 个命令：new / frontend / backend / audit / ship
├── skills/                  # 5 个平台中立 skill（lhg-fs-plan/frontend/backend/audit/memory）
├── agents/                  # 3 个专家 agent（frontend-builder / backend-builder / auditor）
├── hooks/                   # 2 个硬门（commit 前审计拦截 / 无测试警告）+ 豁免说明
├── scripts/audit/           # 62 条确定性自查规则（零第三方依赖）
├── fixtures/                # 冒烟测试用例（坏/好对照）
├── smoke_test.py            # 一键冒烟测试
├── TEMPLATE.md              # 后续插件模板说明（本仓即模板）
├── ATTRIBUTION.md           # 灵感来源与许可声明
└── LICENSE                  # MIT
```

## 什么时候用 / 什么时候不用（FAQ）

**什么时候用：**

- 你想快速把一个想法变成可运行的全栈应用，但不想学全套前后端技术时 → 用 `/lhg-fullstack:new`
- 你已经会写代码，只想让 AI 生成的页面"不那么 AI 味"时 → 装上它，只用 `frontend` 相关能力
- 你要交付给别人用的东西，怕有密钥泄露、SQL 注入、无分页这类硬伤时 → 跑 `/lhg-fullstack:audit` / `/lhg-fullstack:ship`
- 你想给团队立一套"AI 写代码也必须遵守"的纪律时 → 它的 hooks 硬门开箱即用

**什么时候不用：**

- 你只需要一个零散的小 skill（如只做动效、只做 logo）→ 本插件是"全家桶"，单点需求去 skills.sh 找更轻量的
- 你的技术栈明确不用 Next.js/Supabase（如纯 Go/Java 后端）→ 后端 skill 的规范是通用的，但命令流程按默认栈编排，需要自己改
- 你希望 AI 完全自由发挥、不接受任何硬门 → 它的 commit 拦截和 TDD 提醒会让你烦（可关，但那就别装它）

## lhg-plugs 插件矩阵

| 插件 | 一句话 | 安装 |
|---|---|---|
| [lhg-fullstack](https://github.com/lhg-plugs/lhg-fullstack) | 小白一句话 → 高质量全栈应用 | `/plugin install lhg-fullstack@lhg-plugs` |
| *（后续插件在此追加，保持表格格式一致）* | | |

## 自检与反馈

本插件自带质检：每次使用后可跑 `python3 smoke_test.py` 一键验证（JSON 合法、skill/command/agent 完整性、62 条规则、fixtures 命中、hooks 行为）。

发现 bug 或有改进建议，以 `[QC] <一句话问题>` 为标题提交到 https://github.com/lhg-plugs/lhg-fullstack/issues，正文写清"复现步骤 → 实际表现 → 期望表现"。

## 出品：刘洪光

本插件由真人出镜 IP「刘洪光」（安徽合肥）出品，归属 [lhg-skills](https://github.com/lhg-skills)。

- GitHub 主页：https://github.com/lhg-skills —— 全部 skill 开源在此，欢迎 star
- 视频号：搜「刘洪光实名上网」
- 微信：lhgsmsw
