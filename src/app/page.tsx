"use client";

import { useState, useCallback } from "react";
const BASE_PATH = process.env.NODE_ENV === "production" ? "/taishoku-shindan" : "";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ShieldAlert,
  MessageCircleQuestion,
  Leaf,
  RotateCcw,
  CheckCircle2
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "landing" | "quiz" | "result";

interface Choice {
  text: string;
  points: number;
}

interface Question {
  id: number;
  category: string;
  question: string;
  choices: Choice[];
}

interface ResultTier {
  tier: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  paragraphs: string[];
  advice: string[];
  ctaText: string;
  ctaStyle: "strong" | "soft";
  progressColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const questions: Question[] = [
  {
    id: 1,
    category: "メンタルヘルス",
    question: "仕事のことを考えると、夜なかなか眠れないことがありますか？",
    choices: [
      { text: "ほとんどない", points: 1 },
      { text: "月に数回ある", points: 2 },
      { text: "週に何度かある", points: 3 },
      { text: "ほぼ毎日眠れない", points: 4 },
    ],
  },
  {
    id: 2,
    category: "上司との関係",
    question: "上司とのコミュニケーションについて、どう感じていますか？",
    choices: [
      { text: "特に問題なく話せる", points: 1 },
      { text: "少し気を遣うが普通に話せる", points: 2 },
      { text: "話すのが苦痛で避けている", points: 3 },
      { text: "恐怖を感じる・理不尽な扱いを受けている", points: 4 },
    ],
  },
  {
    id: 3,
    category: "体調への影響",
    question: "仕事が原因で、体調に異変を感じることはありますか？",
    choices: [
      { text: "特に体調の変化はない", points: 1 },
      { text: "たまに疲れやすさを感じる", points: 2 },
      { text: "頭痛・胃痛・動悸などが頻繁にある", points: 3 },
      { text: "通院が必要なレベルの症状がある", points: 4 },
    ],
  },
  {
    id: 4,
    category: "職場環境",
    question:
      "職場でハラスメント（パワハラ・セクハラ・モラハラなど）を感じたことはありますか？",
    choices: [
      { text: "感じたことはない", points: 1 },
      { text: "軽いものを感じることがある", points: 2 },
      { text: "明確にハラスメントだと思う行為がある", points: 3 },
      { text: "日常的にハラスメントを受けている", points: 4 },
    ],
  },
  {
    id: 5,
    category: "労働時間",
    question: "残業や休日出勤の状況はどうですか？",
    choices: [
      { text: "ほぼ定時で帰れている", points: 1 },
      { text: "月20時間程度の残業がある", points: 2 },
      { text: "月40時間以上の残業が常態化している", points: 3 },
      { text: "月60時間超え・休日出勤も頻繁にある", points: 4 },
    ],
  },
  {
    id: 6,
    category: "将来性",
    question: "今の会社で自分が成長できると感じますか？",
    choices: [
      { text: "成長できる環境だと思う", points: 1 },
      { text: "ある程度は学べるが限界を感じ始めている", points: 2 },
      { text: "スキルアップの機会がほとんどない", points: 3 },
      { text: "むしろ自分が退化している気がする", points: 4 },
    ],
  },
  {
    id: 7,
    category: "給料と労働量",
    question: "給料と自分の労働量のバランスについてどう感じますか？",
    choices: [
      { text: "妥当だと思う", points: 1 },
      { text: "やや不満はあるが許容範囲", points: 2 },
      { text: "明らかに見合っていない", points: 3 },
      { text: "搾取されていると感じる", points: 4 },
    ],
  },
  {
    id: 8,
    category: "人間関係",
    question: "職場の人間関係全般について、どう感じていますか？",
    choices: [
      { text: "良好で働きやすい", points: 1 },
      { text: "一部に苦手な人はいるが普通", points: 2 },
      { text: "人間関係がストレスの主な原因になっている", points: 3 },
      { text: "孤立している・いじめに近い状況がある", points: 4 },
    ],
  },
  {
    id: 9,
    category: "ワークライフバランス",
    question: "プライベートの時間を十分に確保できていますか？",
    choices: [
      { text: "十分に確保できている", points: 1 },
      { text: "まあまあ確保できている", points: 2 },
      { text: "仕事に追われて趣味や休息の時間がほとんどない", points: 3 },
      { text: "家族や友人との関係にも悪影響が出ている", points: 4 },
    ],
  },
  {
    id: 10,
    category: "総合的な気持ち",
    question: "日曜日の夜、明日からの仕事についてどう感じますか？",
    choices: [
      { text: "特に何も感じない・普通", points: 1 },
      { text: "少し憂鬱になる", points: 2 },
      { text: "強い不安や恐怖を感じる", points: 3 },
      { text: "涙が出る・消えたくなる気持ちになる", points: 4 },
    ],
  },
];

const maxScore = questions.length * 4;

function getResultTier(score: number): ResultTier {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 75) {
    return {
      tier: 1,
      title: "今すぐ退職を考えるべきレベルです",
      icon: <ShieldAlert className="w-16 h-16 text-rose-600" />,
      color: "text-rose-700",
      bgColor: "bg-rose-50/80",
      borderColor: "border-rose-200",
      progressColor: "bg-gradient-to-r from-rose-500 to-red-600",
      paragraphs: [
        "あなたの職場環境は、心身の健康に深刻な影響を与えている可能性が非常に高いです。このまま我慢を続けると、回復に長い時間がかかるほどのダメージを受けてしまうかもしれません。",
        "「辞めたい」と思うことは弱さではありません。むしろ、自分自身を守るための大切なサインです。あなたは十分に頑張ってきました。これ以上、自分を追い込む必要はありません。",
        "一人で退職を切り出すのが難しい場合は、退職代行サービスの利用も選択肢の一つです。あなたに代わって会社とのやり取りをすべて行ってくれるので、精神的な負担を大幅に軽減できます。",
      ],
      advice: [
        "できるだけ早く、信頼できる人に相談しましょう",
        "心療内科の受診も検討してください",
        "退職代行サービスを使えば、会社と直接やり取りせずに辞められます",
        "まずは無料相談だけでも、気持ちが楽になることがあります",
      ],
      ctaText: "退職代行サービスに無料相談する",
      ctaStyle: "strong",
    };
  } else if (percentage >= 50) {
    return {
      tier: 2,
      title: "退職を前向きに検討すべき状況です",
      icon: <AlertTriangle className="w-16 h-16 text-amber-600" />,
      color: "text-amber-700",
      bgColor: "bg-amber-50/80",
      borderColor: "border-amber-200",
      progressColor: "bg-gradient-to-r from-amber-400 to-orange-500",
      paragraphs: [
        "あなたの職場環境には、いくつかの深刻な問題が見受けられます。今はまだ耐えられているかもしれませんが、このまま放置すると状況がさらに悪化する可能性があります。",
        "「もう少し頑張れば...」と思い続けて、気づいたときには心も体も限界だった。そんなケースは少なくありません。まだ余力があるうちに、次のステップを考えることが大切です。",
        "転職活動を始めつつ、もし今すぐにでも辞めたい気持ちがあるなら、退職代行サービスという選択肢もあります。",
      ],
      advice: [
        "転職サイトに登録して、市場価値を確認してみましょう",
        "有給休暇を使って心身を休める時間を作りましょう",
        "退職に必要な準備（貯金・書類確認）を少しずつ始めましょう",
        "退職代行の無料相談で、退職の流れを把握しておくと安心です",
      ],
      ctaText: "退職代行サービスに無料相談する",
      ctaStyle: "strong",
    };
  } else if (percentage >= 25) {
    return {
      tier: 3,
      title: "もう少し状況を見極めましょう",
      icon: <MessageCircleQuestion className="w-16 h-16 text-sky-600" />,
      color: "text-sky-700",
      bgColor: "bg-sky-50/80",
      borderColor: "border-sky-200",
      progressColor: "bg-gradient-to-r from-sky-400 to-blue-500",
      paragraphs: [
        "現時点では深刻な状況とまでは言えませんが、いくつか気になるポイントがあります。小さなストレスも積み重なると大きな問題になることがあるので、注意が必要です。",
        "今のうちに「何が自分にとってストレスなのか」を明確にしておくことが大切です。問題が改善可能なものであれば、上司や人事に相談してみるのも良いでしょう。",
        "ただし、もし改善の見込みがなかったり、状況が悪化するようであれば、早めに次の選択肢を考えておくことをおすすめします。",
      ],
      advice: [
        "ストレスの原因を紙に書き出して整理してみましょう",
        "信頼できる同僚や友人に話を聞いてもらいましょう",
        "改善要望を上司や人事に伝えることも検討しましょう",
        "念のため、退職する場合の流れを知っておくと安心です",
      ],
      ctaText: "退職について詳しく知る",
      ctaStyle: "soft",
    };
  } else {
    return {
      tier: 4,
      title: "今は踏みとどまって改善を試みましょう",
      icon: <Leaf className="w-16 h-16 text-emerald-600" />,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50/80",
      borderColor: "border-emerald-200",
      progressColor: "bg-gradient-to-r from-teal-400 to-emerald-500",
      paragraphs: [
        "診断の結果、あなたの職場環境は比較的安定しているようです。もちろん、完璧な職場は存在しませんが、現時点では大きな問題は見受けられません。",
        "「辞めたい」と感じることは誰にでもあります。一時的な感情なのか、本当に環境を変えるべきなのか、もう少し時間をかけて見極めてみましょう。",
        "もし今後状況が変わったり、新たな悩みが出てきた場合は、いつでもこの診断を受け直してみてください。",
      ],
      advice: [
        "今の環境で改善できることがないか探してみましょう",
        "スキルアップや資格取得に時間を使うのもおすすめです",
        "将来のキャリアプランを考えてみましょう",
        "それでもモヤモヤが続くなら、転職情報を見てみるのもアリです",
      ],
      ctaText: "退職について詳しく知る",
      ctaStyle: "soft",
    };
  }
}

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
};

const slideVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

// ─── Components ──────────────────────────────────────────────────────────────

function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="landing"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeUpVariant}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10"
    >
      <div className="max-w-xl w-full">
        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 sm:p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-full max-w-lg aspect-video mx-auto rounded-3xl shadow-xl shadow-indigo-500/20 mb-8 border border-white overflow-hidden relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/hero-image-v4.png`}
              alt="仕事に悩む若手社員のリアルな写真"
              className="object-cover absolute inset-0 w-full h-full"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-6 text-slate-800 tracking-tight"
          >
            <span className="text-xl sm:text-2xl text-slate-500 font-bold block mb-2">
              今のつらい状況を客観的に可視化する
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">「仕事の辞めどき診断」</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg text-slate-600 mb-8 font-medium leading-relaxed px-4"
          >
            今の職場環境、実はかなりヤバいかも？<br className="hidden sm:block" />
            10の質問であなたの労働環境とストレス状況を客観的にスピード診断。<br />
            迷っているなら、まずはやってみよう！
          </motion.p>

          {/* Description Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-stone-50/50 rounded-2xl p-6 mb-10 text-left border border-white/60"
          >
            <div className="flex flex-col gap-4 text-sm sm:text-base text-stone-600 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <span>所要時間はわずか約3分</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                </div>
                <span>完全無料・個人情報の登録は不要</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" />
                </div>
                <span>あなたの状況に寄り添ったアドバイス</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 400, damping: 10 }}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold py-5 px-12 rounded-full text-xl shadow-[0_10px_40px_-10px_rgba(249,115,22,0.6)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              さっそく診断をやってみる！
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-stone-400 mt-6"
          >
            回答内容は保存されません。あなたのペースで進めてください。
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function QuizView({
  currentQuestion,
  totalQuestions,
  question,
  onAnswer,
  onBack,
  onHome,
}: {
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
  onAnswer: (points: number) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const progress = ((currentQuestion) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 relative z-10 w-full max-w-2xl mx-auto">
      {/* Header & Progress */}
      <div className="mb-4 sm:mb-8 pt-2 sm:pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-indigo-600 mb-1 tracking-wider uppercase">
              {question.category}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-300">
              {String(currentQuestion + 1).padStart(2, '0')}<span className="text-sm text-slate-400 font-medium">/{totalQuestions}</span>
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariant}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* Question Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-full max-w-2xl aspect-[16/8] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-indigo-500/10 mb-4 sm:mb-8 border border-white/50 relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={question.id === 1 ? `${BASE_PATH}/q1-v4.png` : `${BASE_PATH}/q${question.id}-v2.png`}
                alt={`${question.category}に関するイメージ`}
                className="object-cover absolute inset-0 w-full h-full"
              />
            </motion.div>

            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-8 leading-relaxed text-center w-full">
              {question.question}
            </h2>

            <div className="flex flex-col gap-2 sm:gap-3 w-full">
              {question.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onAnswer(choice.points)}
                  className="group relative w-full text-left glass hover:border-indigo-300 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-sm sm:text-lg text-slate-700 transition-colors shadow-sm overflow-hidden flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center text-sm font-bold transition-colors shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{choice.text}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors relative z-10" />

                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>

            <button
              onClick={currentQuestion > 0 ? onBack : onHome}
              className="mt-6 flex items-center gap-1 text-slate-400 hover:text-indigo-600 active:text-indigo-700 transition-colors text-base font-semibold py-2 mx-auto"
            >
              <ChevronLeft className="w-5 h-5" />
              {currentQuestion > 0 ? "前の質問に戻る" : "ホーム画面に戻る"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultView({
  score,
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) {
  const result = getResultTier(score);
  const percentage = Math.round((score / maxScore) * 100);
  const affiliateLink = "https://example.com/taishoku-daiko?ref=shindan";

  return (
    <motion.div
      key="result"
      initial="hidden"
      animate="visible"
      variants={fadeUpVariant}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center px-4 py-12 relative z-10"
    >
      <div className="max-w-2xl w-full">
        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${result.bgColor} ${result.borderColor} border-2 rounded-[2rem] p-8 sm:p-10 text-center mb-8 shadow-xl backdrop-blur-md relative overflow-hidden`}
        >
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                {result.icon}
              </div>
            </motion.div>

            <h2 className={`text-2xl sm:text-3xl font-extrabold ${result.color} mb-8 leading-tight`}>
              {result.title}
            </h2>

            <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-sm font-bold text-slate-500 mb-2 tracking-wide">
                深刻度スコア
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-4">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`text-6xl font-black ${result.color}`}
                >
                  {percentage}
                </motion.span>
                <span className={`text-2xl font-bold ${result.color} opacity-80`}>%</span>
              </div>

              <div className="w-full bg-slate-200/80 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className={`h-full ${result.progressColor}`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Evaluation text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
            診断結果の解説
          </h3>
          <div className="space-y-4">
            {result.paragraphs.map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-8 mb-10 border-l-4 border-l-indigo-500"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-indigo-600 font-bold">!</span>
            </span>
            次に取るべきアクション
          </h3>
          <ul className="flex flex-col gap-4">
            {result.advice.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-slate-700 bg-white/50 p-4 rounded-xl border border-white/60">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-10"
        >
          {result.ctaStyle === "strong" ? (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold py-5 px-8 rounded-2xl text-center text-lg shadow-xl shadow-rose-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {result.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </motion.a>
          ) : (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full glass hover:bg-white border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold py-5 px-8 rounded-2xl text-center text-lg transition-all shadow-sm"
            >
              {result.ctaText}
            </motion.a>
          )}
          {result.ctaStyle === "strong" && (
            <p className="text-center text-sm font-medium text-slate-500 mt-4">
              ※ 相談は完全無料。秘密厳守で安心です。
            </p>
          )}
        </motion.div>

        {/* Restart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pb-8"
        >
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            もう一度診断する
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const handleStart = useCallback(() => {
    setView("quiz");
    setCurrentQuestion(0);
    setScore(0);
    setScoreHistory([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAnswer = useCallback(
    (points: number) => {
      const newScore = score + points;
      setScore(newScore);
      setScoreHistory([...scoreHistory, points]);

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setView("result");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [score, currentQuestion, scoreHistory]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0 && scoreHistory.length > 0) {
      const prevPoints = scoreHistory[scoreHistory.length - 1];
      setScore(score - prevPoints);
      setScoreHistory(scoreHistory.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentQuestion, score, scoreHistory]);

  const handleRestart = useCallback(() => {
    setView("landing");
    setCurrentQuestion(0);
    setScore(0);
    setScoreHistory([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen mesh-bg font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {view === "landing" && <LandingView key="landing" onStart={handleStart} />}
        {view === "quiz" && (
          <QuizView
            key="quiz"
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onHome={handleRestart}
          />
        )}
        {view === "result" && (
          <ResultView key="result" score={score} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </main>
  );
}
