'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useTournamentStore from '@/store/tournamentStore'
import PageLoader from '@/components/PageLoader'

export default function TournamentsPage() {

    const [error, setError] = useState(null)
    const [loadingId, setLoadingId] = useState(null)
    
    const router = useRouter()
    const { tournaments, fetchTournaments, deleteTournament, loading } = useTournamentStore()
    
    useEffect(() => {
      fetchTournaments()
    }, [fetchTournaments])


  if (error) {
    console.error(error)
    return <p className="p-6">Error loading tournaments</p>
  }

  if (loading) {
    return <PageLoader />
  }

  const deleteTournamentHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) {
      return
    }

    setLoadingId(id)

    try {
      await deleteTournament(id)
    } catch (err) {
      console.error(err)
      alert('Failed to delete tournament')
    } finally {
      setLoadingId(null)
    }
  }

  const openBoardHandler = (id) => {

    router.push(`/board/${id}`)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold text-gray-800">Tournaments</h1>

    <div className="space-x-4">
      <button
        type="button"
        onClick={() => router.push('/tournaments/create')}
        className="rounded-full cursor-pointer text-white bg-blue-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
      >
        + Add New
      </button>

      <button
        type="button"
        onClick={() => {}}
        className="rounded-full cursor-pointer text-white bg-gray-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-gray-500/25 transition hover:bg-gray-500"
      >
        Logout
      </button>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
    <table className="min-w-full text-sm">
      
      {/* Header */}
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
        <tr>
          <th className="px-5 py-3 text-left">#</th>
          <th className="px-5 py-3 text-left">Tournament</th>
          <th className="px-5 py-3 text-left">Organizer</th>
          <th className="px-5 py-3 text-left">Teams</th>
          <th className="px-5 py-3 text-left">Actions</th>
        </tr>
      </thead>

      {/* Body */}
      <tbody className="divide-y divide-gray-100">

        {tournaments.length === 0 && (
          <tr>
            <td colSpan="5" className="px-5 py-4 text-center text-gray-500">
              No tournaments found. Click <button onClick={() => router.push('/tournaments/create')} className="text-blue-500 cursor-pointer hover:text-blue-700">Add New</button> to create one.
            </td>
          </tr>
        )}
        
        {tournaments.map((tournament, index) => (
          <tr
            key={tournament.id}
            className="hover:bg-gray-50 transition duration-150"
          >
            {/* Index */}
            <td className="px-5 py-4 font-medium text-gray-700">
              {index + 1}
            </td>

            {/* Tournament */}
            <td className="px-5 py-4">
              <p className="font-semibold text-gray-900">
                {tournament.name}
              </p>
            </td>

            {/* Organizer */}
            <td className="px-5 py-4 text-gray-600">
              {tournament.organizer_name}
            </td>

            {/* Teams */}
            <td className="px-5 py-4">
              <div className="space-y-2 max-w-xs">
                {tournament.teams?.map((team) => (
                  <div
                    key={team.id}
                    className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 hover:shadow-sm transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {team.name}
                      </p>
                      <p className="text-xs text-red-500 font-medium">
                        Warnings: {team.warning}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {team.score}
                    </span>
                  </div>
                ))}
              </div>
            </td>

            {/* Actions */}
            <td className="px-5 py-4 flex gap-4">
              <button
                type="button"
                disabled={loadingId === tournament.id}
                onClick={() => deleteTournamentHandler(tournament.id)}
                className={`rounded-full cursor-pointer text-white px-5 py-2.5 text-sm font-semibold shadow-lg transition 
                  ${loadingId === tournament.id ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 shadow-red-500/25'}`}
              >
                {loadingId === tournament.id ? 'Deleting...' : 'Delete'}
              </button>

              <button
                type="button"
                onClick={() => openBoardHandler(tournament.id)}
                className="rounded-full cursor-pointer text-white bg-blue-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
              >
                Open Board
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    )
}