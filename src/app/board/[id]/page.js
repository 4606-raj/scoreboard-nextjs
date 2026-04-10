"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useTournamentStore from '@/store/tournamentStore'
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader";
import { toast } from "react-toastify";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const { currentTournament, fetchTournamentById, updateTournament, updateScore, updateWarning, updateTimer, loading } = useTournamentStore()

  const [timerVisible, setTimerVisible] = useState(true);
  const [seconds, setSeconds] = useState(currentTournament?.timer_position ?? 240);
  const [running, setRunning] = useState(currentTournament?.timer_status ?? false);
  const [isloading, setIsLoading] = useState(loading)
  
  useEffect(() => {
    if (!params.id) return;

    async function loadCurrentTournament(id) {
      await fetchTournamentById(id)
      .then(() => {
        setIsLoading(false)
        // if(!currentTournament) {
        //   alert('Tournament not found')
        //   router.push('/tournaments/list')
        // }
      })
      .catch(err => {
        console.error(err)
        toast.error('Failed to load tournament details')
        router.push('/tournaments/list')
      })
    }  

    loadCurrentTournament(params.id)
    
  }, [params.id, fetchTournamentById, router]);
  
  useEffect(() => {
    updateTimer({status: running, position: seconds})
    updateTournament()
    
    if (!running) return;

    const interval = setInterval(() => {

      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          updateTimer({status: false, position: seconds})
          updateTournament()
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, updateTimer]);
  
  const changeLeft = (value) => updateScore(0, Math.max(0, currentTournament.teams[0].score + value));
  const changeRight = (value) => updateScore(1, Math.max(0, currentTournament.teams[1].score + value));

  const changeLeftWarning = (value) => updateWarning(0, value);
  const changeRightWarning = (value) => updateWarning(1, value);

  const updateHandler = async () => {
    setIsLoading(true)
    try {
      await updateTournament()
      // alert('Tournament updated successfully')
      toast.success("Updated");
    } catch (err) {
      console.error(err)
      toast.error('Failed to update tournament')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }
  
  return (
    <main className="min-h-screen bg-[#050505] text-slate-100">
      <div className="mx-auto flex min-h-screen flex-col gap-10 px-6 py-7 sm:px-10">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_80px_-32px_rgba(255,255,255,0.25)] backdrop-blur-xl">
          <button onClick={() => router.push(`/tournaments/list`)} className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500">
            Dashboard
          </button>
          <button onClick={updateHandler} className="inline-flex cursor-pointer items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
            {isloading? 'Updateing...' : 'Update'}
          </button>
        </header>

        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {currentTournament ? currentTournament.name : "Tournament Name"}
          </h1>
          <div className="flex flex-col items-center gap-3 rounded-[2.5rem] border border-white/10 bg-white/5 px-7 py-5 shadow-[0_30px_80px_-42px_rgba(255,255,255,0.3)] backdrop-blur-xl sm:flex-row sm:px-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/15 text-3xl">
              <span className="text-4xl">👑</span>
            </div>
            <div>
              <p className="text-lg font-medium text-slate-100">{currentTournament ? currentTournament.organizer : "Organizer Name"}</p>
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
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[0]?.color || 'red'
                }}
              >
                +2
              </button>
              <button
                onClick={() => changeLeft(3)}
                aria-label="Left +2"
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[0]?.color || 'red'
                }}
              >
                +3
              </button>
            </div>

            {/* Left score panel with warning bars below */}
            <div className="flex flex-col gap-4">
              <article className="rounded-[2.5rem] border border-white/10 p-6 shadow-2xl shadow-black/30" style={{ backgroundColor: currentTournament?.teams?.[0]?.color || 'red' }}>
                <div className="mb-5 text-center">
                  <p className="text-2xl font-semibold text-white">{currentTournament ? currentTournament.teams[0].name : "Team Name"}</p>
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
                      { currentTournament?.teams[0].score ?? 0 }
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
                  onClick={() => changeLeftWarning(1)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[0].warning === 1
                      ? "bg-white/90 shadow-lg shadow-white/50"
                      : "bg-white/30"
                  }`}
                  aria-label="Left warning level 1"
                />
                <button
                  onClick={() => changeLeftWarning(2)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[0].warning === 2
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/70"
                      : "bg-cyan-400/30"
                  }`}
                  aria-label="Left warning level 2"
                />
                <button
                  onClick={() => changeLeftWarning(3)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[0].warning === 3
                      ? "bg-lime-400 shadow-lg shadow-lime-400/70"
                      : "bg-lime-400/30"
                  }`}
                  aria-label="Left warning level 3"
                />
                <button
                  onClick={() => changeLeftWarning(4)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[0].warning === 4
                      ? "bg-amber-400 shadow-lg shadow-amber-400/70"
                      : "bg-amber-400/30"
                  }`}
                  aria-label="Left warning level 4"
                />
                <button
                  onClick={() => changeLeftWarning(5)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[0].warning === 5
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
                onClick={() => changeLeft(-2)}
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[0]?.color || 'red'
                }}
              >
                -2
              </button>
              <button
                onClick={() => changeLeft(-3)}
                aria-label="Left -3"
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[0]?.color || 'red'
                }}
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
                onClick={() => changeRight(-2)}
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[1]?.color || 'lightgreen'
                }}
              >
                -2
              </button>
              <button
                onClick={() => changeRight(-3)}
                aria-label="Right -3"
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[1]?.color || 'lightgreen'
                }}
              >
                -3
              </button>
            </div>

            {/* Right score panel with warning bars below */}
            <div className="flex flex-col gap-4">
              <article className="rounded-[2.5rem] border border-white/10 p-6 shadow-2xl shadow-black/30" style={{ backgroundColor: currentTournament?.teams?.[1]?.color || 'lightgreen' }}>
                <div className="mb-5 text-center">
                  <p className="text-2xl font-semibold text-slate-950">{currentTournament ? currentTournament.teams[1].name ?? 0 : 0}</p>
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
                      { currentTournament?.teams[1].score ?? 0 }
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
                  onClick={() => changeRightWarning(1)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[1].warning === 1
                      ? "bg-white/90 shadow-lg shadow-white/50"
                      : "bg-white/30"
                  }`}
                  aria-label="Right warning level 1"
                />
                  <button
                    onClick={() => changeRightWarning(2)}
                    className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                      currentTournament && currentTournament.teams[1].warning === 2
                        ? "bg-cyan-400 shadow-lg shadow-cyan-400/70"
                        : "bg-cyan-400/30"
                    }`}
                    aria-label="Right warning level 2"
                />
                <button
                  onClick={() => changeRightWarning(3)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[1].warning === 3
                      ? "bg-lime-400 shadow-lg shadow-lime-400/70"
                      : "bg-lime-400/30"
                  }`}
                  aria-label="Right warning level 3"
                />
                <button
                  onClick={() => changeRightWarning(4)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[1].warning === 4
                      ? "bg-amber-400 shadow-lg shadow-amber-400/70"
                      : "bg-amber-400/30"
                  }`}
                  aria-label="Right warning level 4"
                />
                <button
                  onClick={() => changeRightWarning(5)}
                  className={`flex-1 cursor-pointer h-3 rounded-full transition ${
                    currentTournament && currentTournament.teams[1].warning === 5
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
                onClick={() => changeRight(2)}
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[1]?.color || 'lightgreen'
                }}
              >
                +2
              </button>
              <button
                onClick={() => changeRight(3)}
                aria-label="Right 3"
                className="cursor-pointer rounded-3xl px-5 py-4 text-lg font-semibold text-slate-950 transition hover:opacity-90"
                style={{
                  backgroundColor: currentTournament?.teams?.[1]?.color || 'lightgreen'
                }}
              >
                +3
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 p-7 text-center shadow-[0_30px_80px_-42px_rgba(255,255,255,0.18)] backdrop-blur-xl">
          {timerVisible && (
            <div className="mt-6 flex items-center justify-center rounded-[2rem] bg-black/30 p-6">
              <span className="font-mono text-[4.5rem] font-semibold tracking-[0.18em] text-white">
                {formatTime(seconds)}
              </span>
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setRunning((current) => !current)}
              className="cursor-pointer rounded-3xl bg-slate-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => setTimerVisible((current) => !current)}
              className="cursor-pointer rounded-3xl bg-slate-700/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              👁️
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setSeconds(240);
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

