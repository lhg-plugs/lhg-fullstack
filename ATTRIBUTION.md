# 灵感来源与致谢（Attribution）

本插件的**方法论灵感**来自以下优秀的开源项目，**所有实现代码、检测规则与文案均为原创**，未复制任何第三方的原文案。

| 项目 | 作者 / 组织 | 许可 | 链接 | 借鉴了什么思路 |
|---|---|---|---|---|
| superpowers | Jesse Vincent（obra） | MIT | https://github.com/obra/superpowers | SDLC 硬门方法论：需求澄清→计划→TDD→评审的强制流水线思想；本插件的 `lhg-fs-plan` 与 hooks 硬门受其启发 |
| skills（官方技能库） | Anthropic | Apache-2.0 | https://github.com/anthropics/skills | `frontend-design` 的"从主题自身世界取材、避开 AI 模板相"等设计指导思想；`webapp-testing` 的测试先行思想 |
| impeccable | Paul Bakaus（Renaissance Geek） | Apache-2.0 | https://github.com/pbakaus/impeccable | "确定性检测规则 + PRODUCT.md / DESIGN.md 项目上下文沉淀"的架构思想；本插件审计脚本的规则引擎模式受其启发，**规则条目全部自研** |
| taste-skill | Leon Lin（Leonxlnx） | MIT | https://github.com/Leonxlnx/taste-skill | anti-slop（反 AI 模板化 UI）的问题意识；本插件 `lhg-fs-frontend` 的规则分类受其启发，**规则文案全部原创** |
| skills（动效） | Emil Kowalski | MIT | https://github.com/emilkowalski/skills | "把专家品味编码成可复用知识包"的模式 |
| agent-skills | Vercel | MIT | https://github.com/vercel-labs/agent-skills | `react-best-practices` / `web-design-guidelines` 的"规则按影响分级 + 可审计"模式 |
| agent-skills | Supabase | MIT | https://github.com/supabase/agent-skills | `supabase-postgres-best-practices` 的"版本化专家知识包"模式；RLS 与连接池的最佳实践思路 |

## 声明

1. **借鉴思路，实现与文案均为原创**：以上项目的具体文案、规则原文、代码实现均未被复制。本插件的 skill 方法论文案、审计规则、命令流程均为独立撰写。
2. **许可合规**：上述项目均为 MIT / Apache-2.0 许可，允许在保留声明的前提下进行思路借鉴与二次创作。本文件即为保留声明的一部分。
3. **商标与归属**：各项目名称与作者署名归其各自所有者所有。

## 本插件自身的许可

本插件原创部分采用 MIT 许可（见 `LICENSE` 文件），版权所有：刘洪光（https://github.com/lhg-skills）。
