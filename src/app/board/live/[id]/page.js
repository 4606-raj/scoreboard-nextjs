"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useTournamentStore from '@/store/tournamentStore'
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader";
import { supabase } from "@/lib/supabase";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function BoardLivePage() {
  const params = useParams()
  const router = useRouter()
  const { currentTournament, fetchTournamentById, subscribeToTournament, loading } = useTournamentStore()
  const [timerVisible, setTimerVisible] = useState(true);

  // const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!params.id) return;

    async function loadCurrentTournament(id) {
      await fetchTournamentById(id)
      .catch(err => {
        console.error(err)
        alert('Failed to load tournament details')
      })

      await subscribeToTournament(params.id)
    }  

    loadCurrentTournament(params.id)
    
  }, [params.id, fetchTournamentById, subscribeToTournament, router]);

  const teamAScore = currentTournament?.teams?.[0]?.score || 0
  const teamBScore = currentTournament?.teams?.[1]?.score || 0

  const teamAWarning = currentTournament?.teams?.[0]?.warning || 0
  const teamBWarning = currentTournament?.teams?.[1]?.warning || 0

  const TimerPosition = currentTournament?.timer_position || 240
  const running = currentTournament?.timer_status || false
  
  const [seconds, setSeconds] = useState(TimerPosition || 240);


  
  // 2. Realtime subscription
  // useEffect(() => {
  //   const channel = supabase
  //     .channel('teams-realtime')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'teams',
  //       },
  //       (payload) => {

  //         if(payload.new.id === currentTournament?.teams[0].id) {
  //           setTeamA(payload.new)
  //         }
          
  //         if(payload.new.id === currentTournament?.teams[1].id) {
  //           setTeamB(payload.new)
  //         }
          
  //         console.log('🔥 Change received!', payload.new.id, teamA?.id ?? 'NA')
  //       }
  //     )
  //     .subscribe((status) => {
  //       console.log('SUB STATUS:', status)
  //     })


  //   return () => {
  //     supabase.removeChannel(channel)
  //   }
  // }, [])
  
  useEffect(() => {
    
    const resetTimer = () => {
      setSeconds(TimerPosition || 240)
    }
    
    if(TimerPosition !== 0) {
      resetTimer()
    }

    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          // setRunning(false);
          setSeconds(TimerPosition || 240)
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  if (loading) {
    return <PageLoader />
  }
  
  return (
    <main className="min-h-screen bg-[#050505] text-slate-100">
      <div className="mx-auto flex min-h-screen flex-col gap-10 px-6 py-7 sm:px-10">

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
            <div className="flex flex-col justify-between"></div>

            {/* Left score panel with warning bars below */}
            <div className="flex flex-col gap-4">
              <article className="rounded-[2.5rem] border border-white/10 p-6 shadow-2xl shadow-black/30" style={{ backgroundColor: currentTournament?.teams?.[0]?.color || 'red' }}>
                <div className="mb-5 text-center">
                  <p className="text-2xl font-semibold text-white">{currentTournament ? currentTournament.teams[0].name : "Team Name"}</p>
                </div>
                <div className="flex items-center justify-center gap-4 rounded-[2rem] bg-black/15 p-5">
                  <div className="min-w-[160px] text-center">
                    <p className="text-7xl font-extrabold tracking-[0.3rem] text-white">
                      { teamAScore }
                    </p>
                  </div>
                </div>
              </article>

              {/* Warning level indicators - glow when clicked */}
              <div className="flex gap-3 rounded-3xl p-4">
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamAWarning === 1
                      ? "bg-white/90 shadow-lg shadow-white/50"
                      : "bg-white/30"
                  }`}
                  aria-label="Left warning level 1"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamAWarning === 2
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/70"
                      : "bg-cyan-400/30"
                  }`}
                  aria-label="Left warning level 2"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamAWarning === 3
                      ? "bg-lime-400 shadow-lg shadow-lime-400/70"
                      : "bg-lime-400/30"
                  }`}
                  aria-label="Left warning level 3"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamAWarning === 4
                      ? "bg-amber-400 shadow-lg shadow-amber-400/70"
                      : "bg-amber-400/30"
                  }`}
                  aria-label="Left warning level 4"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamAWarning === 5
                      ? "bg-red-500 shadow-lg shadow-red-500/70"
                      : "bg-red-500/30"
                  }`}
                  aria-label="Left warning level 5"
                />
              </div>
            </div>

          </div>

          {/* Right Board with corner buttons */}
          <div className="grid gap-4 grid-cols-[auto_1fr_auto]">
            {/* Top left corner buttons */}
            <div className="flex flex-col justify-between"></div>

            {/* Right score panel with warning bars below */}
            <div className="flex flex-col gap-4">
              <article className="rounded-[2.5rem] border border-white/10 p-6 shadow-2xl shadow-black/30" style={{ backgroundColor: currentTournament?.teams?.[1]?.color || 'lightgreen' }}>
                <div className="mb-5 text-center">
                  <p className="text-2xl font-semibold text-slate-950">{currentTournament ? currentTournament.teams[1].name : "Team Name"}</p>
                </div>
                <div className="flex items-center justify-center gap-4 rounded-[2rem] bg-black/15 p-5">
                  <div className="min-w-[160px] text-center">
                    <p className="text-7xl font-extrabold tracking-[0.3rem] text-white">
                      { teamBScore }
                    </p>
                  </div>
                </div>
              </article>

              {/* Warning level indicators - glow when clicked */}
              <div className="flex gap-3 rounded-3xl p-4">
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamBWarning === 1
                      ? "bg-white/90 shadow-lg shadow-white/50"
                      : "bg-white/30"
                  }`}
                  aria-label="Right warning level 1"
                />
                  <button
                    onClick={() => {}}
                    className={`flex-1 h-3 rounded-full transition ${
                      teamBWarning === 2
                        ? "bg-cyan-400 shadow-lg shadow-cyan-400/70"
                        : "bg-cyan-400/30"
                    }`}
                    aria-label="Right warning level 2"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamBWarning === 3
                      ? "bg-lime-400 shadow-lg shadow-lime-400/70"
                      : "bg-lime-400/30"
                  }`}
                  aria-label="Right warning level 3"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamBWarning === 4
                      ? "bg-amber-400 shadow-lg shadow-amber-400/70"
                      : "bg-amber-400/30"
                  }`}
                  aria-label="Right warning level 4"
                />
                <button
                  onClick={() => {}}
                  className={`flex-1 h-3 rounded-full transition ${
                    teamBWarning === 5
                      ? "bg-red-500 shadow-lg shadow-red-500/70"
                      : "bg-red-500/30"
                  }`}
                  aria-label="Right warning level 5"
                />
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

