"use client";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/taishoku-shindan" : "";

const AFFILIATE_LINK =
  "https://yamedoki.co.jp/rt/?_rt_ck=9372.260323888309&ct_p10c1c4264aIe6c6=6.2.365.DzxsCgXAGy2eCaVx.365.DzxsCgXAGy2eCaVx.DzxsCgXAGy2eCaVx";

export default function Home() {
  return (
    <main className="h-[100dvh] flex flex-col items-center justify-center px-3 sm:px-6 mesh-bg font-sans overflow-hidden">
      <div className="max-w-lg w-full">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] px-4 py-3 sm:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">

          {/* Title */}
          <h1 className="font-extrabold leading-tight mb-1 sm:mb-3 text-slate-800 tracking-tight">
            <span className="text-sm sm:text-xl text-slate-500 font-bold block mb-0.5">
              仕事がつらい、もう限界かも…
            </span>
            <span className="text-xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              そんなあなたへ
            </span>
          </h1>

          <p className="text-[11px] sm:text-base text-slate-500 mb-2 sm:mb-4 leading-relaxed">
            一人で抱え込まなくて大丈夫。<br />
            まずは気軽に相談してみませんか？
          </p>

          {/* Instruction Box */}
          <div className="w-full border-4 sm:border-[5px] border-yellow-400 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-2.5 sm:mb-5 shadow-xl shadow-yellow-400/40 ring-2 sm:ring-4 ring-yellow-300/40 relative">
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-yellow-300/10 animate-pulse pointer-events-none" />

            <p className="font-black text-center mb-2 sm:mb-5 text-lg sm:text-2xl text-slate-900 relative">
              ⚠️ ご利用方法
            </p>

            <div className="space-y-2 sm:space-y-4 relative">
              <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 border-2 border-yellow-300">
                <p className="text-slate-700 text-xs sm:text-base font-bold leading-relaxed">
                  下の
                  <span className="text-green-600 text-base sm:text-xl font-black">緑色のボタン</span>
                  を
                  <span className="text-red-600 text-base sm:text-xl font-black underline decoration-[3px] decoration-red-500 underline-offset-2">長押し</span>
                </p>
                <p className="text-slate-700 text-xs sm:text-base font-bold mt-0.5">
                  → 「ブラウザで開く」を選択
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 border-2 border-yellow-300">
                <p className="text-slate-700 text-xs sm:text-base font-bold leading-relaxed">
                  または、画面右上の
                  <span className="text-red-600 text-base sm:text-xl font-black bg-red-50 px-1 rounded mx-0.5">「…」</span>
                  メニュー
                </p>
                <p className="text-slate-700 text-xs sm:text-base font-bold mt-0.5">
                  → 「ブラウザで開く」を選択
                </p>
              </div>
            </div>

            <p className="text-[9px] sm:text-sm text-slate-400 mt-2 sm:mt-4 text-center leading-relaxed relative">
              ※ アプリ内ブラウザでは正常に表示されない場合があります。<br className="sm:hidden" />
              Safari・Chromeなどの外部ブラウザでお開きください。
            </p>
          </div>

          {/* Green CTA Button */}
          <a
            href={AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700 text-white font-extrabold text-base sm:text-2xl py-3 sm:py-5 rounded-full text-center shadow-[0_10px_30px_-10px_rgba(34,197,94,0.6)] transition-all"
          >
            詳しくはこちら
          </a>

          <p className="text-[9px] sm:text-sm text-slate-400 mt-1.5 sm:mt-3">
            ※ 相談は完全無料・秘密厳守です
          </p>
        </div>
      </div>
    </main>
  );
}
