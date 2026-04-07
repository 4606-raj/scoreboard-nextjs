import { supabase } from '@/lib/supabase'

export default async function TournamentsPage() {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
        id,
        name,
        organizer,
        teams (
            id,
            name,
            score,
            warning
        )
        `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <p className="p-6">Error loading tournaments</p>
  }

  if (!data || data.length === 0) {
    return <p className="p-6">No tournaments found</p>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Tournaments
        </h1>

        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow">
        <table className="min-w-full text-sm">
            
            {/* Header */}
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
            <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Tournament</th>
                <th className="px-4 py-3 text-left">Organizer</th>
                <th className="px-4 py-3 text-left">Teams</th>
            </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-200">
            {data.map((tournament, index) => (
                <tr
                key={tournament.id}
                className="hover:bg-gray-50 transition"
                >
                
                {/* Index */}
                <td className="px-4 py-4 text-gray-700 font-medium">
                    {index + 1}
                </td>

                {/* Tournament */}
                <td className="px-4 py-4 font-semibold text-gray-900">
                    {tournament.name}
                </td>

                {/* Organizer */}
                <td className="px-4 py-4 text-gray-700">
                    {tournament.organizer_name}
                </td>

                {/* Teams */}
                <td className="px-4 py-4">
                    <div className="space-y-2">
                    {tournament.teams?.map((team) => (
                        <div
                        key={team.id}
                        className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                        >
                        <div>
                            <p className="font-medium text-gray-900">
                            {team.name}
                            </p>
                            <p className="text-xs text-red-500 font-medium">
                            Warnings: {team.warning}
                            </p>
                        </div>

                        <span className="text-sm font-bold text-blue-600">
                            {team.score}
                        </span>
                        </div>
                    ))}
                    </div>
                </td>

                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
    )
}