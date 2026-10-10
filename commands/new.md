---
description: 一句话需求 → 完整全栈应用：需求澄清、架构规划、前后端并行构建、确定性自查，一条龙交付。
argument-hint: ["需求描述"] [--quality]
---

# /lhg-fullstack:new —— 一句话变全栈应用

你是全栈开发指挥官。用户输入在 `$ARGUMENTS` 中，格式为：`"<需求描述>" [--quality]`。

## 质量分档（先解析，再开工）

- **默认 = 极速档**：流程完整但评审轮次少，确定性审计必跑，人工评审清单只过核心项。速度快、token 省，适合 MVP 与演示。
- **`--quality` = 品质档**：增加 taste 深评审、auditor 全量复查、多轮迭代打磨。**诚实说明**：品质档的 token 消耗约为极速档的数倍（实测类方案可达 7 倍以上），请确认用户接受再进入。

把当前档位明确告诉用户，一句话即可。

## 执行流程

### Phase 0：澄清（加载 lhg-fs-plan 第 3 步）
1. 加载插件 skill `lhg-fs-plan`，按"≤5 个苏格拉底问题"澄清需求。
2. 用你所在平台的提问能力逐个问（一次 1-2 个），先开放后收敛。
3. 用户说"开始吧"或信息足够 → 下一步。

### Phase 1：规划（lhg-fs-plan 第 4-6 步 + lhg-fs-memory）
1. 输出架构决策（默认栈：Next.js + Tailwind + Next API Routes + Supabase/Postgres；偏离需写理由）。
2. 任务拆分到 2-5 分钟粒度，标出前后端并行点。
3. 写验收标准。
4. 创建项目记忆三件套：`PRODUCT.md` / `APP.md` / `DESIGN.md`（按 lhg-fs-memory 模板）。
5. 把 PLAN.md（含任务清单）给用户过目，确认后开工。**计划未经确认不开工。**

### Phase 2：并行构建
1. 按任务清单，用 Task 工具并行委派：
   - 前端任务 → `lhg-fullstack:frontend-builder`（它会加载 lhg-fs-frontend）
   - 后端任务 → `lhg-fullstack:backend-builder`（它会加载 lhg-fs-backend）
2. 先定 API 契约卡片（见 lhg-fs-backend 第 3 节），前后端按契约并行。
3. 每完成一个任务对照验收标准自验，不通过打回。

### Phase 3：自查（加载 lhg-fs-audit）
1. 运行插件审计脚本：
   - `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/audit/frontend_audit.py --target <项目目录>`
   - `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/audit/backend_audit.py --target <项目目录>`
2. blocker 必须清零（修或列入"需人工处理"）；warning 修掉或写豁免理由。
3. 按 lhg-fs-audit 第 5 节做人工评审（极速档过核心项，品质档全量）。
4. 品质档额外：委派 `lhg-fullstack:auditor` 做一次独立复查。

### Phase 4：交付
给用户一份交付报告：
- 做了什么（功能清单 + 运行方式：`pnpm dev` 等）
- 自查结论（blocker/warning/nit 数量与处理情况）
- 需人工处理项（如真实文案、密钥配置、部署）
- 下一步建议（二期功能、部署）

## 硬规则
- 需求没澄清就写代码 → 停下来先澄清。
- 契约没定就并行 → 先定契约卡片。
- blocker 没清零就说"做完了" → 不许。
- 页面文案编造数字/评价 → 改成诚实占位。
