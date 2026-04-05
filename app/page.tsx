"use client";

import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState<"points" | "amount">("points");

  // ポイント計算
  const [currentPoints, setCurrentPoints] = useState("");
  const [targetPoints, setTargetPoints] = useState("");
  const [deadline, setDeadline] = useState("");
  const [workDays, setWorkDays] = useState("");

  // 金額計算
  const [targetAmount, setTargetAmount] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [amountCurrentPoints, setAmountCurrentPoints] = useState("");

  // ── ポイント計算ロジック ──
  const current = parseFloat(currentPoints) || 0;
  const target = parseFloat(targetPoints) || 0;
  const remaining = target > 0 ? Math.max(0, target - current) : 0;
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const isGoalReached = target > 0 && current >= target;
  const hasTarget = target > 0;

  let dailyPoints: number | null = null;
  let daysCount: number | null = null;
  let calcMode: "manual" | "deadline" | "month" | null = null;

  if (hasTarget && !isGoalReached) {
    const parsedWorkDays = parseFloat(workDays);
    if (workDays && parsedWorkDays > 0) {
      daysCount = parsedWorkDays;
      dailyPoints = remaining / daysCount;
      calcMode = "manual";
    } else if (deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(deadline + "T00:00:00");
      deadlineDate.setHours(0, 0, 0, 0);
      const diff =
        Math.floor(
          (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      if (diff > 0) {
        daysCount = diff;
        dailyPoints = remaining / daysCount;
        calcMode = "deadline";
      }
    } else {
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const diff = lastDay.getDate() - today.getDate() + 1;
      daysCount = diff;
      dailyPoints = remaining / daysCount;
      calcMode = "month";
    }
  }

  // ── 金額計算ロジック ──
  const amount = parseFloat(targetAmount) || 0;
  const multi = parseFloat(multiplier) || 0;
  const amountCurrent = parseFloat(amountCurrentPoints) || 0;
  const hasAmountCalc = amount > 0 && multi > 0;
  const neededPoints = hasAmountCalc ? amount / multi : 0;
  const remainingForAmount = hasAmountCalc ? Math.max(0, neededPoints - amountCurrent) : 0;
  const amountProgress = hasAmountCalc ? Math.min(100, (amountCurrent / neededPoints) * 100) : 0;
  const isAmountGoalReached = hasAmountCalc && amountCurrent >= neededPoints;

  const todayDisplay = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-rose-100 via-fuchsia-50 to-violet-100" />
      <div className="fixed top-[-15%] left-[-10%] w-[65vw] max-w-[550px] aspect-square rounded-full bg-pink-300/50 blur-[90px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[55vw] max-w-[480px] aspect-square rounded-full bg-violet-300/45 blur-[90px] pointer-events-none" />
      <div className="fixed top-[35%] right-[5%] w-[40vw] max-w-[360px] aspect-square rounded-full bg-fuchsia-200/60 blur-[70px] pointer-events-none" />
      <div className="fixed top-[10%] left-[55%] w-[30vw] max-w-[280px] aspect-square rounded-full bg-rose-200/50 blur-[60px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[5%] w-[35vw] max-w-[300px] aspect-square rounded-full bg-sky-200/40 blur-[70px] pointer-events-none" />

      <main className="relative z-10 min-h-screen flex flex-col items-center py-10 sm:py-14 px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-10 w-full max-w-lg">
          <p className="text-fuchsia-400 text-sm mb-2 font-medium tracking-wide">
            {todayDisplay}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
            ポイント計算機
          </h1>
          <p className="mt-3 text-slate-500 text-sm sm:text-base">
            目標達成に必要なポイントを確認しましょう ✨
          </p>
        </div>

        <div className="w-full max-w-lg">
          {/* ── タブ ── */}
          <div className="flex bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-1 mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <button
              onClick={() => setTab("points")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "points"
                  ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.35)]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              🎯 ポイント計算
            </button>
            <button
              onClick={() => setTab("amount")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "amount"
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-[0_4px_12px_rgba(251,191,36,0.4)]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              💰 金額から計算
            </button>
          </div>

          <div className="space-y-4">
            {/* ════ ポイント計算タブ ════ */}
            {tab === "points" && (
              <>
                {/* ポイント入力カード */}
                <div className="bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_8px_32px_rgba(236,72,153,0.1),0_2px_8px_rgba(0,0,0,0.06)] rounded-3xl p-6 sm:p-8">
                  <h2 className="text-fuchsia-400 text-xs font-bold uppercase tracking-[0.18em] mb-5">
                    ポイントを入力
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-500 text-sm font-medium block mb-2">
                        現在のポイント
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={currentPoints}
                          onChange={(e) => setCurrentPoints(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-white/80 border border-rose-200/70 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200/60 rounded-2xl px-5 py-4 text-slate-700 text-2xl font-bold placeholder:text-slate-300 outline-none transition-all pr-16"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                          pt
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-500 text-sm font-medium block mb-2">
                        目標ポイント
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={targetPoints}
                          onChange={(e) => setTargetPoints(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-white/80 border border-rose-200/70 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200/60 rounded-2xl px-5 py-4 text-slate-700 text-2xl font-bold placeholder:text-slate-300 outline-none transition-all pr-16"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                          pt
                        </span>
                      </div>
                    </div>
                  </div>

                  {hasTarget && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 font-medium">達成率</span>
                        <span className="text-fuchsia-500 font-bold tabular-nums">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-rose-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400 transition-all duration-700 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 残りポイント結果 */}
                {hasTarget && (
                  <div
                    className={`backdrop-blur-2xl border rounded-3xl p-7 sm:p-9 text-center transition-all duration-500 ${
                      isGoalReached
                        ? "bg-emerald-50/80 border-emerald-200 shadow-[0_8px_32px_rgba(52,211,153,0.2)]"
                        : "bg-white/65 border-white/90 shadow-[0_8px_32px_rgba(236,72,153,0.12),0_2px_8px_rgba(0,0,0,0.06)]"
                    }`}
                  >
                    {isGoalReached ? (
                      <div>
                        <div className="text-5xl mb-3">🎉</div>
                        <p className="text-emerald-600 text-2xl font-bold">目標達成！</p>
                        <p className="text-emerald-500 text-sm mt-2">おめでとうございます！</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.18em] mb-4">
                          残り必要ポイント
                        </p>
                        <div className="flex items-end justify-center gap-2">
                          <span
                            className="font-bold tracking-tight leading-none tabular-nums bg-gradient-to-br from-fuchsia-500 to-rose-400 bg-clip-text text-transparent"
                            style={{ fontSize: "clamp(3rem, 15vw, 5.5rem)" }}
                          >
                            {remaining.toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-2xl font-semibold pb-1.5">pt</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-4 tabular-nums">
                          {current.toLocaleString()} pt /{" "}
                          <span className="text-slate-500 font-semibold">
                            {target.toLocaleString()} pt
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 稼働スケジュール */}
                {hasTarget && !isGoalReached && (
                  <div className="bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_8px_32px_rgba(139,92,246,0.1),0_2px_8px_rgba(0,0,0,0.06)] rounded-3xl p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-5">
                      <h2 className="text-violet-400 text-xs font-bold uppercase tracking-[0.18em]">
                        稼働スケジュール
                      </h2>
                      <span className="text-slate-400 text-xs">— 省略可</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-500 text-sm font-medium block mb-1">
                          目標達成日
                        </label>
                        <p className="text-slate-400 text-xs mb-2">
                          未入力の場合は今月末で計算します
                        </p>
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          min={minDate}
                          className="w-full bg-white/80 border border-violet-200/70 focus:border-violet-400 focus:ring-2 focus:ring-violet-200/60 rounded-2xl px-5 py-4 text-slate-700 text-base outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 text-sm font-medium block mb-1">
                          出勤可能日数
                        </label>
                        <p className="text-slate-400 text-xs mb-2">
                          未入力の場合は毎日稼働として計算します
                        </p>
                        <div className="relative">
                          <input
                            type="number"
                            value={workDays}
                            onChange={(e) => setWorkDays(e.target.value)}
                            placeholder="0"
                            min="1"
                            className="w-full bg-white/80 border border-violet-200/70 focus:border-violet-400 focus:ring-2 focus:ring-violet-200/60 rounded-2xl px-5 py-4 text-slate-700 text-2xl font-bold placeholder:text-slate-300 outline-none transition-all pr-16"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                            日
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1日あたりポイント */}
                {hasTarget && !isGoalReached && dailyPoints !== null && daysCount !== null && (
                  <div className="bg-white/65 backdrop-blur-2xl border border-violet-200/60 shadow-[0_8px_32px_rgba(139,92,246,0.15),0_2px_8px_rgba(0,0,0,0.06)] rounded-3xl p-7 sm:p-9 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.18em] mb-4">
                      1日あたり必要ポイント
                    </p>
                    <div className="flex items-end justify-center gap-2">
                      <span
                        className="font-bold tracking-tight leading-none tabular-nums bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
                        style={{ fontSize: "clamp(3rem, 15vw, 5.5rem)" }}
                      >
                        {Math.ceil(dailyPoints).toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-xl font-semibold pb-1.5">pt/日</span>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-violet-200/50" />
                      <p className="text-slate-500 text-xs whitespace-nowrap font-medium">
                        {calcMode === "manual"
                          ? `出勤日数 ${daysCount}日で計算`
                          : calcMode === "deadline"
                          ? `今日〜目標日 ${daysCount}日で計算`
                          : `今月残り ${daysCount}日で計算`}
                      </p>
                      <div className="h-px flex-1 bg-violet-200/50" />
                    </div>
                    {dailyPoints !== Math.ceil(dailyPoints) && (
                      <p className="text-slate-400 text-xs mt-3">
                        ※ 切り上げ表示（正確には {dailyPoints.toFixed(1)} pt/日）
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ════ 金額計算タブ ════ */}
            {tab === "amount" && (
              <>
                {/* 金額入力カード */}
                <div className="bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_8px_32px_rgba(251,191,36,0.12),0_2px_8px_rgba(0,0,0,0.06)] rounded-3xl p-6 sm:p-8">
                  <h2 className="text-amber-500 text-xs font-bold uppercase tracking-[0.18em] mb-1">
                    金額・ポイント変換
                  </h2>
                  <p className="text-slate-400 text-xs mb-5">
                    例）500pt × 掛け率 = 目標金額
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-500 text-sm font-medium block mb-2">
                        目標金額
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                          ¥
                        </span>
                        <input
                          type="number"
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-white/80 border border-amber-200/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 rounded-2xl pl-10 pr-5 py-4 text-slate-700 text-2xl font-bold placeholder:text-slate-300 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-500 text-sm font-medium block mb-1">
                        掛け率
                      </label>
                      <p className="text-amber-400 text-xs mb-2">
                        ※ スタッフに確認してください
                      </p>
                      <div className="relative">
                        <input
                          type="number"
                          value={multiplier}
                          onChange={(e) => setMultiplier(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-white/80 border border-amber-200/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 rounded-2xl px-5 py-4 text-slate-700 text-2xl font-bold placeholder:text-slate-300 outline-none transition-all pr-16"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                          倍
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-500 text-sm font-medium block mb-2">
                        現在のポイント
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amountCurrentPoints}
                          onChange={(e) => setAmountCurrentPoints(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-white/80 border border-amber-200/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 rounded-2xl px-5 py-4 text-slate-700 text-2xl font-bold placeholder:text-slate-300 outline-none transition-all pr-16"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                          pt
                        </span>
                      </div>
                    </div>
                  </div>

                  {hasAmountCalc && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 font-medium">達成率</span>
                        <span className="text-amber-500 font-bold tabular-nums">
                          {amountProgress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 transition-all duration-700 ease-out"
                          style={{ width: `${amountProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 金額計算結果 */}
                {hasAmountCalc && (
                  <div
                    className={`backdrop-blur-2xl border rounded-3xl p-7 sm:p-9 text-center transition-all duration-500 ${
                      isAmountGoalReached
                        ? "bg-emerald-50/80 border-emerald-200 shadow-[0_8px_32px_rgba(52,211,153,0.2)]"
                        : "bg-white/65 border-amber-200/60 shadow-[0_8px_32px_rgba(251,191,36,0.18),0_2px_8px_rgba(0,0,0,0.06)]"
                    }`}
                  >
                    {isAmountGoalReached ? (
                      <div>
                        <div className="text-5xl mb-3">🎉</div>
                        <p className="text-emerald-600 text-2xl font-bold">目標達成！</p>
                        <p className="text-emerald-500 text-sm mt-2">おめでとうございます！</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.18em] mb-1">
                          必要合計ポイント
                        </p>
                        <p className="text-amber-400 text-xs mb-3 tabular-nums">
                          ¥{amount.toLocaleString()} ÷ {multi} 倍
                        </p>
                        <div className="flex items-end justify-center gap-2 mb-6">
                          <span
                            className="font-bold tracking-tight leading-none tabular-nums bg-gradient-to-br from-yellow-500 to-amber-500 bg-clip-text text-transparent"
                            style={{ fontSize: "clamp(2.5rem, 12vw, 4.5rem)" }}
                          >
                            {Math.ceil(neededPoints).toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-xl font-semibold pb-1.5">pt</span>
                        </div>
                        <div className="border-t border-amber-100 pt-5">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.18em] mb-4">
                            残り必要ポイント
                          </p>
                          <div className="flex items-end justify-center gap-2">
                            <span
                              className="font-bold tracking-tight leading-none tabular-nums bg-gradient-to-br from-amber-500 to-orange-400 bg-clip-text text-transparent"
                              style={{ fontSize: "clamp(3rem, 15vw, 5.5rem)" }}
                            >
                              {Math.ceil(remainingForAmount).toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-2xl font-semibold pb-1.5">pt</span>
                          </div>
                          <p className="text-slate-400 text-sm mt-4 tabular-nums">
                            {amountCurrent.toLocaleString()} pt /{" "}
                            <span className="text-slate-500 font-semibold">
                              {Math.ceil(neededPoints).toLocaleString()} pt
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* フッター */}
            <p className="text-center text-slate-400 text-xs py-4">
              ポイント計算機 — みつばちライブ 🐝
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
