// 冒烟测试：故意埋了 20+ 处硬伤的坏 fixture（请勿作为示例代码）
import React from "react";

const apiKey = "sk-abc1234567890abcdef";

const testimonials = [
  { name: "王总", text: "非常好用，强烈推荐！改变了我的工作方式。" },
  { name: "李经理", text: "五星好评，用户都说好。" },
];

export default function BadPage() {
  console.log("debug page render");
  const items = ["a", "b", "c"];

  const handleClick = () => {
    alert("clicked");
  };

  return (
    <div className="bg-black min-h-screen">
      {/* TODO: 换成真实文案 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 shadow-purple-500/50 shadow-2xl">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-600 text-6xl">
          最好的产品
        </h1>
        <p>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="w-[1200px] mx-auto">
        <img src="/hero.png" />
        <div onClick={handleClick} className="cursor-pointer text-[#3b82f6]">
          点我
        </div>
        <a target="_blank" href="https://example.com">外链</a>
        <a href="#">了解更多</a>
        <input type="text" placeholder="搜索" />
      </div>

      <div className="grid grid-cols-6 gap-4">
        {items.map((it, index) => (
          <div key={index} className="backdrop-blur-md bg-white/10 p-4">
            <div className="backdrop-blur-md">卡片{it}</div>
            <div className="backdrop-blur-md">卡片{it}</div>
            <div className="backdrop-blur-md">卡片{it}</div>
            <div className="backdrop-blur-md">卡片{it}</div>
            <div className="backdrop-blur-md">卡片{it}</div>
          </div>
        ))}
      </div>

      <div className="text-[13px] leading-[27px] p-[17px] m-[9px] w-[333px] h-[111px] rounded-[7px] border-[3px] gap-[11px]">
        任意值
      </div>

      <div dangerouslySetInnerHTML={{ __html: "<b>hi</b>" }} />
    </div>
  );
}
