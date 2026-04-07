"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function CreateTournamentPage() {
  const [tournamentName, setTournamentName] = useState("");
  const [organiserName, setOrganiserName] = useState("");
  const [logo, setLogo] = useState("");
  const [team1Name, setTeam1Name] = useState("");
  const [team1Color, setTeam1Color] = useState("#FFB84D");
  const [team2Name, setTeam2Name] = useState("");
  const [team2Color, setTeam2Color] = useState("#B495FF");

  const handleSubmit = async (e) => {
        e.preventDefault();
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
    };

  return (
    <main className="min-h-screen bg-[#050505] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[800px] flex-col gap-8 px-6 py-7 sm:px-10">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_80px_-32px_rgba(255,255,255,0.25)] backdrop-blur-xl">
          <h1 className="text-2xl font-semibold text-white">Create Tournament</h1>
          <button className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500">
            Back
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Tournament Information Section */}
          <section className="space-y-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">Tournament Information</h2>

            {/* Tournament Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Tournament Name</label>
              <input
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="Enter tournament name"
                className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-500 transition focus:border-white/30 focus:outline-none"
              />
            </div>

            {/* Organiser Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Organiser Name</label>
              <input
                type="text"
                value={organiserName}
                onChange={(e) => setOrganiserName(e.target.value)}
                placeholder="Enter organiser name"
                className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-500 transition focus:border-white/30 focus:outline-none"
              />
            </div>

            {/* Logo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Logo</label>
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
                className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white transition focus:border-white/30 focus:outline-none"
              />
              {logo && (
                <div className="mt-4 flex justify-center">
                  <img src={logo} alt="Logo preview" className="max-h-20 rounded-lg" />
                </div>
              )}
            </div>
          </section>

          {/* Teams Section */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Team 1 */}
            <div className="space-y-4 rounded-[2.5rem] border border-white/10 bg-amber-500/10 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Team 1</h2>

              {/* Team 1 Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Team Name</label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Enter team name"
                  className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-500 transition focus:border-white/30 focus:outline-none"
                />
              </div>

              {/* Team 1 Color */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Team Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={team1Color}
                    onChange={(e) => setTeam1Color(e.target.value)}
                    className="cursor-pointer h-12 w-20 rounded-2xl border border-white/10"
                  />
                  <div
                    className="flex-1 rounded-2xl border border-white/10"
                    style={{ backgroundColor: team1Color }}
                  />
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-4 rounded-[2.5rem] border border-white/10 bg-violet-500/10 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Team 2</h2>

              {/* Team 2 Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Team Name</label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Enter team name"
                  className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-500 transition focus:border-white/30 focus:outline-none"
                />
              </div>

              {/* Team 2 Color */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Team Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={team2Color}
                    onChange={(e) => setTeam2Color(e.target.value)}
                    className="cursor-pointer h-12 w-20 rounded-2xl border border-white/10"
                  />
                  <div
                    className="flex-1 rounded-2xl border border-white/10"
                    style={{ backgroundColor: team2Color }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer rounded-3xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            Create Tournament
          </button>
        </form>
      </div>
    </main>
  );
}
