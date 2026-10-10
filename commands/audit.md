---
description: 前后端体检：跑确定性审计脚本 + 人工评审清单，输出分级报告并自动修复 blocker。
argument-hint: [项目目录] [--fix]
---

# /lhg-fullstack:audit —— 前后端体检

用户输入在 `$ARGUMENTS` 中：`[项目目录] [--fix]`。目录缺省为当前项目根目录。

## 流程（加载 lhg-fs-audit 全程指导）

### 1. 跑脚本
```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/audit/frontend_audit.py --target <目录> --format text
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/audit/backend_audit.py  --target <目录> --format text
```
记下 blocker / warning / nit 的数量与明细（含文件、行号、规则说明）。

### 2. 分级与修复
- blocker：逐条修。`--fix` 缺省即自动修（最小改动原则）；修一条用脚本复查一条。
- 修不掉的（如需用户提供真实文案/密钥）→ 列入"需人工处理"，不许为清零改规则。
- warning：修掉或写豁免理由（+有效期）；nit：顺手修。

### 3. 人工评审
按 lhg-fs-audit 第 5 节清单执行：
- 前端：文案真实性、模板相、对比度抽查、动效、空/错/加载三态
- 后端：鉴权一致性、越权测试、错误码一致性、幂等实测、边界 case

### 4. 输出报告
按 lhg-fs-audit 第 6 节模板输出自查报告，存为 `docs/audit-YYYYMMDD.md`，结论写清"通过 / 不通过"。

## 硬规则
- 有 blocker 就说"通过" → 不许。
- 为清零改脚本规则或阈值 → 这是作弊，不许。
