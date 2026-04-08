"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTournamentPage() {
  const [tournamentName, setTournamentName] = useState("");
  const [organiserName, setOrganiserName] = useState("");
  const [logo, setLogo] = useState("");
  const [team1Name, setTeam1Name] = useState("");
  const [team1Color, setTeam1Color] = useState("#FFB84D");
  const [team2Name, setTeam2Name] = useState("");
  const [team2Color, setTeam2Color] = useState("#B495FF");

  const router = useRouter();

  const handleSubmit = async (e) => {
        e.preventDefault();

        // validate
        if (!tournamentName || !organiserName || !team1Name || !team2Name) {
            alert("Please fill in all fields");
            return;
        }
        
        const tournamentData = {
            name: tournamentName,
            organizer: organiserName,
            logo: logo,
        };

        const { data, error } = await supabase.from('tournaments').insert([tournamentData]).select()

        if (error) console.error(error)

        const teamData = [
            {
                name: team1Name,
                color: team1Color,
                tournament_id: data[0].id,
            },
            {
                name: team2Name,
                color: team2Color,
                tournament_id: data[0].id,
            }
        ];
        
        await supabase.from('teams').insert(teamData).select();

        router.push(`/tournaments/list`);
    };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-[900px] flex-col gap-8 px-6 py-7">

        {/* Header */}
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl shadow-[0_20px_80px_-32px_rgba(255,255,255,0.25)]">
          <h1 className="text-2xl font-semibold">
            Create Tournament
          </h1>

          <button className="rounded-full text-white bg-blue-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 transition hover:bg-blue-500" onClick={() => router.push('/tournaments/list')}>
            Back
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Tournament Info */}
          <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-lg font-semibold">
              Tournament Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Tournament Name</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="Enter tournament name"
                  className="rounded-xl border border-slate-500 px-4 py-3 placeholder-slate-500 focus:border-white/30"
                />
              </div>

              {/* Organizer */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Organizer Name</label>
                <input
                  type="text"
                  value={organiserName}
                  onChange={(e) => setOrganiserName(e.target.value)}
                  placeholder="Enter organizer name"
                  className="rounded-xl border border-slate-500 px-4 py-3 placeholder-slate-500 focus:border-white/30"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setLogo(event.target?.result || "");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3"
              />

              {logo && (
                <div className="mt-3 flex justify-start">
                  <img
                    src={logo}
                    alt="preview"
                    className="h-16 rounded-lg border border-white/10"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Teams */}
          <section className="grid gap-6 md:grid-cols-2">

            {/* Team 1 */}
            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl">
              <h2 className="text-sm font-semibold">Team 1</h2>

              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Team name"
                className="rounded-xl border border-slate-500 px-4 py-3 placeholder-slate-500 focus:border-white/30"
              />

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={team1Color}
                  onChange={(e) => setTeam1Color(e.target.value)}
                  className="h-10 w-14 rounded-lg border border-white/10"
                />
                {/* <div
                  className="h-10 flex-1 rounded-lg border border-white/10"
                  style={{ backgroundColor: team1Color }}
                /> */}
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl">
              <h2 className="text-sm font-semibold">Team 2</h2>

              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="Team name"
                className="rounded-xl border border-slate-500 px-4 py-3 placeholder-slate-500 focus:border-white/30"
              />

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={team2Color}
                  onChange={(e) => setTeam2Color(e.target.value)}
                  className="h-10 w-14 rounded-lg border border-white/10"
                />
                {/* <div
                  className="h-10 flex-1 rounded-lg border border-white/10"
                  style={{ backgroundColor: team2Color }}
                /> */}
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="rounded-2xl text-white bg-emerald-500 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            Create Tournament
          </button>
        </form>
      </div>
  </main>
  );
}
