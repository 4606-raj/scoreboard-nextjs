import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

let tournamentChannel = null

const tournamentStore = create((set, get) => ({
  tournaments: [],
  currentTournament: null,
  loading: false,
  error: null,

  updateScore: (teamIndex, newScore) =>
    set((state) => ({
      currentTournament: {
        ...state.currentTournament,
        teams: state.currentTournament.teams.map((team, i) =>
          i === teamIndex
            ? { ...team, score: newScore }
            : team
        ),
      },
    })),

    updateWarning: (teamIndex, newWarning) =>
      set((state) => ({
        currentTournament: {
          ...state.currentTournament,
          teams: state.currentTournament.teams.map((team, i) =>
            i === teamIndex
              ? { ...team, warning: newWarning }
              : team
          ),
        },
      })),

      updateTimer: ({status, position}) =>
        set((state) => ({
        currentTournament: {
          ...state.currentTournament,
          timer_status: status,
          timer_position: position
        }
      })),


  // READ
  fetchTournaments: async () => {
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          teams (*)
        `)

      if (error) throw error

      set({
        tournaments: data,
        loading: false
      })
    } catch (err) {
      set({
        error: err.message,
        loading: false
      })
    }
  },

  // CREATE (tournament + teams)
  createTournament: async ({ name, organizer, logo, teams }) => {
    try {
      // 1. Create tournament
      const { data, error } = await supabase
        .from('tournaments')
        .insert([{ name, organizer, logo }])
        .select()

      if (error) throw error

      const tournamentId = data[0].id

      // 2. Create teams
      const teamPayload = teams.map(team => ({
        ...team,
        tournament_id: tournamentId
      }))

      const { error: teamError } = await supabase
        .from('teams')
        .insert(teamPayload)

      if (teamError) throw teamError

      const newTournament = {
        ...data[0],
        teams: teamPayload
      }

      set({
        tournaments: [newTournament, ...get().tournaments]
      })

      return newTournament
    } catch (err) {
      throw err
    }
  },

  // DELETE
  deleteTournament: async (id) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({
        tournaments: get().tournaments.filter(t => t.id !== id)
      })
    } catch (err) {
      throw err
    }
  },

  // READ (single)
  fetchTournamentById: async (id) => {
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          teams (*)
        `)
        .eq('id', id)
        .order('id', { foreignTable: 'teams', ascending: true })
        .single()

      if (error) throw error

      set({
        currentTournament: data,
        loading: false
      })
    } catch (err) {
      set({
        error: err.message,
        loading: false
      })
    }
  },

  subscribeToTournament: (id) => {
  // cleanup old channel
  if (tournamentChannel) {
    supabase.removeChannel(tournamentChannel);
    tournamentChannel = null;
  }

  tournamentChannel = supabase
    .channel("tournament-live")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "teams",
        filter: `tournament_id=eq.${id}`,
      },
      async (payload) => {
        const current = get().currentTournament;
        if (!current) return;

        // ---------------------------
        // 1. Update teams optimistically
        // ---------------------------
        let updatedTeams = current.teams ?? [];

        if (payload.eventType === "DELETE") {
          updatedTeams = updatedTeams.filter(
            (team) => team.id !== payload.old.id
          );
        } else if (payload.eventType === "INSERT") {
          updatedTeams = [...updatedTeams, payload.new];
        } else {
          updatedTeams = updatedTeams.map((team) =>
            team.id === payload.new.id ? payload.new : team
          );
        }

        // ---------------------------
        // 2. Get latest tournament row
        // ---------------------------
        const { data: tournament } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single();

        if (!tournament) return;

        // ---------------------------
        // 3. Sync both into store
        // ---------------------------
        set({
          currentTournament: {
            ...tournament,   // tournament table data
            teams: updatedTeams, // merged teams
          },
        });
      }
    )
    .subscribe();
},

  updateTournament: async () => {
    try {
      const { currentTournament } = get();

      if (!currentTournament) return;

      const tournamentUpdate = supabase
        .from('tournaments')
        .update({
          timer_status: currentTournament.timer_status,
          timer_position: currentTournament.timer_position,
        })
        .eq('id', currentTournament.id);

      if (!currentTournament.teams) return;

      const teamUpdates = currentTournament.teams.map((team) =>
        supabase
          .from('teams')
          .update({
            score: team.score,
            warning: team.warning,
          })
          .eq('id', team.id)
      );

      const results = await Promise.all([
        tournamentUpdate,
        ...teamUpdates,
      ]);

      // optional: check for errors
      results.forEach(({ error }) => {
        if (error) throw error
      })

    } catch (err) {
      console.error('Update failed:', err)
      throw err
    }
  },
  
}))

export default tournamentStore