import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

const tournamentStore = create((set, get) => ({
  tournaments: [],
  loading: false,
  error: null,

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
  }
}))

export default tournamentStore