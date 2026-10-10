// 冒烟测试：干净对照 fixture（无硬伤）
import React from "react";
import Image from "next/image";

const features = [
  { title: "快速上手", desc: "三步完成配置，文档齐全。" },
  { title: "稳定可靠", desc: "核心链路有测试覆盖。" },
  { title: "持续迭代", desc: "每周发布，按需回滚。" },
];

export default function GoodPage() {
  return (
    <main className="bg-surface min-h-screen">
      <header className="mx-auto max-w-5xl px-6 py-8 flex items-center justify-between">
        <span className="text-xl font-bold text-ink">示例产品</span>
        <nav aria-label="主导航" className="flex gap-6">
          <a href="/features" className="text-ink-secondary">功能</a>
          <a href="/pricing" className="text-ink-secondary">价格待定</a>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl font-bold text-ink">为小团队打造的工具箱</h1>
          <p className="mt-4 text-lg text-ink-secondary leading-relaxed">
            内测中，欢迎预约演示。
          </p>
          <div className="mt-8 flex gap-4">
            <a href="/signup" className="btn-primary">预约演示</a>
            <a href="/docs" className="btn-ghost">查看文档</a>
          </div>
        </div>
        <div>
          <Image src="/hero.png" alt="产品主界面截图" width={640} height={400} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold text-ink">核心功能</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="p-6 rounded-lg border border-line">
              <h3 className="font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-ink-secondary">{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12" aria-label="用户评价">
        <h2 className="text-2xl font-bold text-ink">用户评价</h2>
        <p className="mt-4 text-ink-secondary">用户评价（待补充，内测结束后更新）</p>
      </section>
    </main>
  );
}
