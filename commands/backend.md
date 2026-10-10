---
description: 只做后端：先定 API 契约，再实现接口与数据库，附安全基线自查。
argument-hint: ["接口/需求描述"] [--quality]
---

# /lhg-fullstack:backend —— 后端单做

用户输入在 `$ARGUMENTS` 中：`"<接口或需求描述>" [--quality]`。

## 流程

### 1. 准备
1. 加载插件 skill `lhg-fs-backend`。
2. 读项目 `APP.md`（技术栈、目录、环境变量）。新项目先定技术栈（默认 Next API Routes + Supabase/Postgres）。

### 2. 先写契约（不许跳过）
按 lhg-fs-backend 第 3 节输出契约卡片：
- 方法 + 路径（含 `/v1` 版本）
- 入参与出参形状
- 错误码（`{code, message}`，code 大写下划线）
- 分页/幂等要求（如适用）

契约给用户（或前端）确认后再实现。已有契约时先核对一致性。

### 3. 实现
1. 数据库：先写 migration（表 + 索引 + RLS 策略），再写接口。
2. 接口：按契约实现，统一错误形状，列表必分页，创建类接口支持幂等键。
3. 全程遵守 8 条安全基线（密钥、校验、参数化、哈希、脱敏、CORS、日志、依赖）。

### 4. 自查
1. 跑 `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/audit/backend_audit.py --target <项目目录>`，blocker 清零。
2. 对照 lhg-fs-backend 第 7 节上线前检查清单（按需裁剪）。
3. `--quality` 档：实测幂等（重复请求不重复创建）与越权（A 看不到 B 的数据）两个 case。

### 5. 交付
告诉用户：实现了哪几个接口（贴契约卡片）、migration 文件位置、自查结论、需要配置的环境变量。
