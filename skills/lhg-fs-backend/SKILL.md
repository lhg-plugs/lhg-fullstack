---
name: lhg-fs-backend
description: 后端实现方法论：原创 API 设计规范（REST 命名、统一错误形状、分页、幂等、版本）+ 数据库（schema、索引、RLS、连接池）+ 安全基线。写任何接口前先加载它。
license: MIT
compatibility: 适用于任何支持 Markdown 指令的 AI 编程助手（Claude Code、豆包、Workbuddy 等）
metadata:
  version: 1.0.0
  author: 刘洪光
---

# lhg-fs-backend：后端实现方法论

> 目标：API 让前端"一次对接成功"，数据库"上线不爆雷"，安全"基线不漏水"。
> 核心纪律：**先定契约，再写实现；契约变更先改文档，再改代码。**

## 1. 何时使用

- 新建任何 API 接口前 → 加载本 skill，先定契约
- 设计数据库表结构前 → 看第 4 节
- 评审后端代码 / 上线前检查 → 用第 7 节清单

## 2. API 设计规范

### 2.1 资源命名

1. 用**复数名词**表示资源：`/v1/orders`、`/v1/users`，不用 `/v1/order`，不用动词（`/v1/createOrder` ❌）。
2. 嵌套不超过 2 层：`/v1/orders/{id}/items` ✅；`/v1/users/{id}/orders/{oid}/items` ❌（太深了，拍平或用查询参数）。
3. 动作用子资源或查询参数表达：`/v1/orders/{id}/cancel`（POST）✅；`/v1/cancelOrder` ❌。
4. 命名一律小写 + 连字符或下划线二选一，全项目统一（推荐下划线，与数据库 snake_case 对齐）。

### 2.2 HTTP 方法与状态码

| 场景 | 方法 | 成功状态码 |
|---|---|---|
| 查列表 / 查详情 | GET | 200 |
| 创建 | POST | 201（返回创建的资源） |
| 全量替换 | PUT | 200 |
| 部分更新 | PATCH | 200 |
| 删除 | DELETE | 204（无返回体）或 200（返回删除确认） |

错误状态码只用这几个，不要自创：400（参数错）、401（未登录）、403（无权限）、404（不存在）、409（冲突，如重复创建）、422（语义错，如库存不足）、429（限流）、500（服务端错）。

### 2.3 统一错误形状（强制）

所有错误返回同一形状，前端只用写一套错误处理：

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "订单不存在",
  "details": { "order_id": "123" }
}
```

- `code`：大写下划线，领域前缀 + 具体原因（`ORDER_NOT_FOUND`、`PAYMENT_INSUFFICIENT`），不要裸数字。
- `message`：给人看的中文一句话，不要把异常堆栈吐给客户端。
- `details`：可选，机器可读的补充字段。
- 成功返回里**不许**出现 `code`/`message` 字段，避免前后端误判。

### 2.4 分页（强制）

1. 所有列表接口必须分页，不许"先全量返回，以后再加"。
2. 优先 cursor 分页（数据量大/实时性高），简单场景可用 page/page_size。
3. 返回形状：
```json
{
  "data": [ ... ],
  "page_info": { "next_cursor": "abc", "has_more": true }
}
```
4. `limit` 默认 20，最大 200，超限按 200 截断并在响应头或字段中说明。

### 2.5 过滤、排序、搜索

- 过滤：`GET /v1/orders?status=paid&created_after=2026-01-01`，字段名与资源字段一致。
- 排序：`?sort=-created_at`（减号表倒序），只允许白名单字段排序。
- 搜索：`?q=关键词`，说明搜的是哪些字段。

### 2.6 幂等

1. 所有"创建类" POST 接口支持 `Idempotency-Key` 请求头：同 key 重复请求返回第一次的结果，不重复创建。
2. key 由客户端生成（UUID），服务端存 24 小时。
3. 前端按钮防抖是体验优化，**不能替代**服务端幂等。

### 2.7 版本策略

1. URL 带版本：`/v1/orders`。破坏性变更（删字段、改形状）才升 `/v2`，加字段不算破坏。
2. 废弃版本提前一个版本周期公告，返回头带 `Deprecation: true`。
3. 小项目可以只维护一个版本，但 URL 里保留 `/v1`，给未来留路。

### 2.8 认证与限流

- 认证：`Authorization: Bearer <token>`，JWT；公开接口明确标注，无需"默认公开、事后补鉴权"。
- 限流：429 + `Retry-After` 头；登录、短信、支付类接口必须有限流，普通接口建议有。

## 3. 先写契约，再写实现

1. 接口动手前，先写"契约卡片"（Markdown 表格即可，不必上 OpenAPI 重武器）：
```
POST /v1/orders
- 入参：{ items: [{sku_id, qty}], idempotency_key? }
- 成功 201：{ id, status, total }
- 错误：ORDER_ITEMS_EMPTY(422) / PRODUCT_NOT_FOUND(404)
```
2. 前后端按契约卡片并行开发，联调时以契约为准撕逼，不以口头为准。
3. 契约变更 → 先改卡片 → 通知对方 → 再改代码。

## 4. 数据库

### 4.1 Schema 设计

1. 命名：表名复数 snake_case（`orders`），字段 snake_case（`created_at`），全项目统一。
2. 主键：对外暴露的用 UUID（防遍历），内部关联可用自增 ID；二选一，不要混用。
3. 每表必备：`id`、`created_at`、`updated_at`；需要审计加 `created_by`。
4. 软删除是 trade-off：需要"可恢复/审计"用 `deleted_at`，否则物理删除更干净。选了就要全项目一致。
5. 外键：逻辑有关联就建外键约束，不要"靠应用层保证一致性"。

### 4.2 索引

1. 外键字段、WHERE 条件字段、排序字段 → 建索引。
2. 复合索引遵循最左前缀：`(user_id, created_at)` 能服务 `where user_id=? order by created_at`，反过来不行。
3. 索引不是越多越好：写多读少的表，索引是负担。先按 1-2 建，上线后看慢查询再加。
4. 上线前检查：把核心查询的执行计划看一遍，确认走了索引。

### 4.3 RLS（Supabase 行级安全）

1. 只要表里有多用户的数据，RLS 必须开，不要"先关掉，上线再说"——上线再说等于永远不开。
2. 策略按"谁能看/改哪几行"写：如 `auth.uid() = user_id` 的行才能读写自己的订单。
3. 每个策略写一条对应的测试：A 用户调接口，断言看不到 B 用户的数据。
4. 服务端可信代码（如定时任务）用 service_role 绕过 RLS，但**绝不**把 service key 发给前端。

### 4.4 连接池

1. Serverless / 边缘函数环境必须用连接池（Supabase 的 transaction pooler），直连会打爆数据库连接数。
2. 应用内数据库客户端用单例，不要每个请求 new 一个。
3. 本地开发与生产用同一套连接方式，避免"本地能跑、线上爆连接"。

### 4.5 迁移

1. 表结构变更走 migration 文件，文件名带时间戳与语义（`20261011_add_orders_table.sql`）。
2. 迁移必须可回滚（至少 down 脚本能写出来），不要手改生产库。
3. 删字段/删表先"废弃一版"再删，给代码留过渡期。

## 5. 安全基线（8 条，条条必查）

1. **密钥进环境变量**：API key、数据库密码、JWT secret 一律 `process.env`，禁止硬编码，禁止提交 `.env`。
2. **输入校验**：所有外部输入（body、query、params）先校验再使用，白名单优于黑名单；用 zod/yup 这类 schema 库，不要手写 if。
3. **参数化查询**：SQL 一律参数化，禁止字符串拼接；ORM 也不要用 raw 拼。
4. **密码哈希**：bcrypt/argon2，加盐；登录比较用哈希比较，禁止明文比对。
5. **错误信息脱敏**：返回给客户端的错误不许带堆栈、SQL、文件路径。
6. **CORS 收紧**：`Access-Control-Allow-Origin` 写明确域名，禁止 `*`（除非纯公开 API）。
7. **日志脱敏**：日志里不许出现密码、token、完整手机号/身份证。
8. **依赖更新**：上线前把有已知高危漏洞的依赖升了，不要"以后再说"。

## 6. Next.js + Supabase 落地映射

- API Routes：`app/api/v1/orders/route.ts`，按 2.x 规范实现；每个 handler 包 try/catch，统一走错误形状。
- Supabase：表走 SQL migration 建，RLS 策略随表一起提交；前端用 anon key + RLS，可信服务端用 service_role。
- 环境变量：`.env.local`（本地）/ 平台环境变量（生产），`.env.example` 提交仓库当模板。

## 7. 上线前检查清单

- [ ] 所有接口有契约卡片，且代码与契约一致
- [ ] 错误形状统一为 `{code, message}`，无裸字符串错误
- [ ] 列表接口全部分页，limit 有上限
- [ ] RLS 已开且有越权测试
- [ ] 8 条安全基线逐条通过
- [ ] `.env` 未提交，`.env.example` 已更新
- [ ] 确定性审计脚本零 blocker（见 lhg-fs-audit）
- [ ] 核心链路（注册→下单→支付回调等）有测试覆盖或手工走查记录

## 8. 反模式

- ❌ "先全量返回，分页以后加"——以后就是永远
- ❌ 错误直接 `return res.json(error)`——把堆栈送给全世界
- ❌ RLS 先关掉调通再说——等于没调
- ❌ 用 `Math.random()` 生成 token/密码——用密码学安全随机数
- ❌ DELETE 不带 WHERE 条件——先写 WHERE，再写 DELETE，顺序不能反

## 9. 自检与反馈

每次执行完本 skill，做一次轻量自检：

1. 是否有接口没写契约卡片就实现了？→ 补卡片。
2. 错误形状是否有例外？→ 统一掉。
3. 是否有列表接口没分页？→ 加上。
4. 8 条安全基线是否逐条检查过？→ 没查不算完。

标准冒烟用例：设计"博客系统的文章/评论接口"契约，检查命名、错误形状、分页、幂等是否符合本规范。

反馈渠道：以 `[QC] <一句话问题>` 为标题提交到 https://github.com/lhg-plugs/lhg-fullstack/issues，正文写清"输入 → 错误输出 → 期望输出"。

## 出品：刘洪光

本 skill 由真人出镜 IP「刘洪光」（安徽合肥）出品，归属 [lhg-skills](https://github.com/lhg-skills)。

- GitHub 主页：https://github.com/lhg-skills —— 全部 skill 开源在此，欢迎 star
- 视频号：搜「刘洪光实名上网」
- 微信：lhgsmsw
