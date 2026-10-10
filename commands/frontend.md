---
description: 只做前端：按自研 taste 规则实现页面，移动端优先，附确定性自查。
argument-hint: ["页面/需求描述"] [--quality]
---

# /lhg-fullstack:frontend —— 前端单做

用户输入在 `$ARGUMENTS` 中：`"<页面或需求描述>" [--quality]`。

## 流程

### 1. 准备
1. 加载插件 skill `lhg-fs-frontend`。
2. 读项目 `DESIGN.md`（设计令牌 + 页面清单）与 `PRODUCT.md`（产品事实）。没有 DESIGN.md 时先定设计令牌（颜色/字体/间距），不许带着空白开工。

### 2. 布局先行
按 lhg-fs-frontend 第 7 节画 ASCII 布局草图，给用户确认（小改动可自行决定，大改必须确认）。

### 3. 实现
按"静态结构 → 数据接入 → 交互 → 动效"顺序写组件，全程遵守：
- 禁 AI 模板相（紫粉渐变、霓虹暗黑、卡片套娃、渐变标题字、hero 三件套照搬）
- 内容诚实（不编造数字/评价/客户 logo）
- 设计令牌优先（零硬编码色值）
- 移动端优先（390px 起步，无横向滚动）

### 4. 自查
1. 跑 `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/audit/frontend_audit.py --target <项目目录>`，blocker 清零。
2. 对照 lhg-fs-frontend 第 10 节自查清单逐项打勾。
3. `--quality` 档：额外做一轮 taste 深评审（找 3 处可提升的细节并改掉）。

### 5. 交付
告诉用户：做了哪个页面、怎么看效果、自查结论、有哪几处用了诚实占位（待补充）。
