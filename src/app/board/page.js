"use client";

import { useEffect, useState } from "react";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function BoardPage() {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [seconds, setSeconds] = useState(180);
  const [running, setRunning] = useState(false);
  const [scoreVisible, setScoreVisible] = useState(true);
  const [leftWarning, setLeftWarning] = useState(null);
  const [rightWarning, setRightWarning] = useState(null);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const changeLeft = (value) => setLeftScore((prev) => Math.max(0, prev + value));
  const changeRight = (value) => setRightScore((prev) => Math.max(0, prev + value));

  return (
    <main className="min-h-screen bg-[#050505] text-slate-100">
      <div className="mx-auto flex min-h-screen flex-col gap-10 px-6 py-7 sm:px-10">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_80px_-32px_rgba(255,255,255,0.25)] backdrop-blur-xl">
          <button className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500">
            Dashboard
          </button>
          <button className="inline-flex cursor-pointer items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
            Update
          </button>
        </header>

        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Ut et culpa consecte
          </h1>
          <div className="flex flex-col items-center gap-3 rounded-[2.5rem] border border-white/10 bg-white/5 px-7 py-5 shadow-[0_30px_80px_-42px_rgba(255,255,255,0.3)] backdrop-blur-xl sm:flex-row sm:px-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/15 text-3xl">
              <span className="text-4xl">👑</span>
            </div>
            <div>
              <p className="text-lg font-medium text-slate-100">Eu fugit at ad volu</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left Board with corner buttons */}
          <div className="grid gap-4 grid-cols-[auto_1fr_auto]">
            {/* Top left corner buttons */}
            <div className="flex flex-col justify-between">
              <button
                onClick={() => changeLeft(2)}
                className="cursor-pointer rounded-3xl bg-yellow-500/95 px-5 py-4 text-lg font-semibold text-slate-950 transition hover:bg-yellow-400"
              >
                +2
              </button>
              <button
                onClick={() => changeLeft(-2)}
                aria-label="Left -2"
                className="cursor-pointer h-16 min-w-[90px] rounded-3xl bg-yellow-500/95 text-lg font-semibold text-slate-950 transition hover:bg-yellow-400"
              >
                -2
              </button>
            </div>

            {/* Left score panel with warning bars below */}
            <div className="flex flex-col gap-4">
              <article className="rounded-[2.5rem] border border-white/10 bg-amber-500/95 p-6 shadow-2xl shadow-black/30">
                <div className="mb-5 text-center">
                  <p className="text-2xl font-semibold text-white">Officia quia quaerat</p>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-black/15 p-5">
                  <button
                    onClick={() => changeLeft(-1)}
                    className="flex cursor-pointer h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-black/20 text-2xl text-white transition hover:bg-black/30"
                  >
                    −
                  </button>
                  <div className="min-w-[160px] text-center">
                    <p className="text-7xl font-extrabold tracking-[0.3rem] text-white">
                      {scoreVisible ? leftScore : "--"}
                    </p>
                  </div>
                  <button
                    onClick={() => changeLeft(1)}
                    className="flex cursor-pointer h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-black/20 text-3xl text-white transition hover:bg-black/30"
                  >
                    +
                  </button>
                </div>
              </article>

              {/* Warning level indicators - glow when clicked */}
              <div className="flex gap-3 rounded-3xl p-4">
                <button
                  onClick={() => setLeftWarning(0)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    leftWarning === 0
                      ? "bg-white/90 shadow-lg shadow-white/50"
                      : "bg-white/30"
                  }`}
                  aria-label="Left warning level 1"
                />
                <button
                  onClick={() => setLeftWarning(1)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    leftWarning === 1
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/70"
                      : "bg-cyan-400/30"
                  }`}
                  aria-label="Left warning level 2"
                />
                <button
                  onClick={() => setLeftWarning(2)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    leftWarning === 2
                      ? "bg-lime-400 shadow-lg shadow-lime-400/70"
                      : "bg-lime-400/30"
                  }`}
                  aria-label="Left warning level 3"
                />
                <button
                  onClick={() => setLeftWarning(3)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    leftWarning === 3
                      ? "bg-amber-400 shadow-lg shadow-amber-400/70"
                      : "bg-amber-400/30"
                  }`}
                  aria-label="Left warning level 4"
                />
                <button
                  onClick={() => setLeftWarning(4)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    leftWarning === 4
                      ? "bg-red-500 shadow-lg shadow-red-500/70"
                      : "bg-red-500/30"
                  }`}
                  aria-label="Left warning level 5"
                />
              </div>
            </div>

            {/* Top right corner buttons */}
            <div className="flex flex-col justify-between">
              <button
                onClick={() => changeLeft(3)}
                className="cursor-pointer rounded-3xl bg-yellow-500/95 px-5 py-4 text-lg font-semibold text-slate-950 transition hover:bg-yellow-400"
              >
                +3
              </button>
              <button
                onClick={() => changeLeft(-3)}
                aria-label="Left -3"
                className="cursor-pointer h-16 min-w-[90px] rounded-3xl bg-yellow-500/95 text-lg font-semibold text-slate-950 transition hover:bg-yellow-400"
              >
                -3
              </button>
            </div>
          </div>

          {/* Right Board with corner buttons */}
          <div className="grid gap-4 grid-cols-[auto_1fr_auto]">
            {/* Top left corner buttons */}
            <div className="flex flex-col justify-between">
              <button
                onClick={() => changeRight(2)}
                className="cursor-pointer rounded-3xl bg-violet-400 px-5 py-4 text-lg font-semibold text-slate-950 transition hover:bg-violet-300"
              >
                +2
              </button>
              <button
                onClick={() => changeRight(-2)}
                aria-label="Right -2"
                className="cursor-pointer h-16 min-w-[90px] rounded-3xl bg-violet-400 text-lg font-semibold text-slate-950 transition hover:bg-violet-300"
              >
                -2
              </button>
            </div>

            {/* Right score panel with warning bars below */}
            <div className="flex flex-col gap-4">
              <article className="rounded-[2.5rem] border border-white/10 bg-violet-400/95 p-6 shadow-2xl shadow-black/30">
                <div className="mb-5 text-center">
                  <p className="text-2xl font-semibold text-slate-950">Sequi est qui Nam d</p>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-black/15 p-5">
                  <button
                    onClick={() => changeRight(-1)}
                    className="flex cursor-pointer h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-black/20 text-2xl text-white transition hover:bg-black/30"
                  >
                    −
                  </button>
                  <div className="min-w-[160px] text-center">
                    <p className="text-7xl font-extrabold tracking-[0.3rem] text-white">
                      {scoreVisible ? rightScore : "--"}
                    </p>
                  </div>
                  <button
                    onClick={() => changeRight(1)}
                    className="flex cursor-pointer h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-black/20 text-3xl text-white transition hover:bg-black/30"
                  >
                    +
                  </button>
                </div>
              </article>

              {/* Warning level indicators - glow when clicked */}
              <div className="flex gap-3 rounded-3xl p-4">
                <button
                  onClick={() => setRightWarning(0)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    rightWarning === 0
                      ? "bg-white/90 shadow-lg shadow-white/50"
                      : "bg-white/30"
                  }`}
                  aria-label="Right warning level 1"
                />
                <button
                  onClick={() => setRightWarning(1)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    rightWarning === 1
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/70"
                      : "bg-cyan-400/30"
                  }`}
                  aria-label="Right warning level 2"
                />
                <button
                  onClick={() => setRightWarning(2)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    rightWarning === 2
                      ? "bg-lime-400 shadow-lg shadow-lime-400/70"
                      : "bg-lime-400/30"
                  }`}
                  aria-label="Right warning level 3"
                />
                <button
                  onClick={() => setRightWarning(3)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    rightWarning === 3
                      ? "bg-amber-400 shadow-lg shadow-amber-400/70"
                      : "bg-amber-400/30"
                  }`}
                  aria-label="Right warning level 4"
                />
                <button
                  onClick={() => setRightWarning(4)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    rightWarning === 4
                      ? "bg-red-500 shadow-lg shadow-red-500/70"
                      : "bg-red-500/30"
                  }`}
                  aria-label="Right warning level 5"
                />
              </div>
            </div>

            {/* Top right corner buttons */}
            <div className="flex flex-col justify-between">
              <button
                onClick={() => changeRight(3)}
                className="cursor-pointer rounded-3xl bg-violet-400 px-5 py-4 text-lg font-semibold text-slate-950 transition hover:bg-violet-300"
              >
                +3
              </button>
              <button
                onClick={() => changeRight(-3)}
                aria-label="Right -3"
                className="cursor-pointer h-16 min-w-[90px] rounded-3xl bg-violet-400 text-lg font-semibold text-slate-950 transition hover:bg-violet-300"
              >
                -3
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 p-7 text-center shadow-[0_30px_80px_-42px_rgba(255,255,255,0.18)] backdrop-blur-xl">
          <div className="mt-6 flex items-center justify-center rounded-[2rem] bg-black/30 p-6">
            <span className="font-mono text-[4.5rem] font-semibold tracking-[0.18em] text-white">
              {formatTime(seconds)}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setRunning((current) => !current)}
              className="cursor-pointer rounded-3xl bg-slate-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => setScoreVisible((current) => !current)}
              className="cursor-pointer rounded-3xl bg-slate-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              👁️
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setSeconds(180);
              }}
              className="cursor-pointer rounded-3xl bg-slate-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </main>
  );                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

