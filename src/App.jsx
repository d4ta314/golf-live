import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Scoreboard from './Scoreboard'
import SetupForm from './SetupForm'
import EditMatchModal from './EditMatchModal'

const demoCompetition = {
  id: 'demo',
  code: 'DEMO01',
  name: 'Championnat de France',
  date: new Date().toISOString().split('T')[0],
  team_name: 'AS Golf Marseille',
  opponent_name: 'Golf de Saint-Cloud',
  admin_pin: '1234',
}

const demoMatches = [
  { id: 1, type: 'double', position: 1, player_name: 'Dupont / Martin', opponent_name: 'Garcia / Lopez', score: 2, thru: 14, status: 'in_progress', result: null },
  { id: 2, type: 'double', position: 2, player_name: 'Leroy / Petit', opponent_name: 'Smith / Jones', score: 3, thru: 16, status: 'finished', result: 'win' },
  { id: 3, type: 'simple', position: 1, player_name: 'Lambert', opponent_name: 'Thompson', score: -1, thru: 12, status: 'in_progress', result: null },
  { id: 4, type: 'simple', position: 2, player_name: 'Moreau', opponent_name: 'Williams', score: 0, thru: 10, status: 'in_progress', result: null },
  { id: 5, type: 'simple', position: 3, player_name: 'Bernard', opponent_name: 'Brown', score: 4, thru: 15, status: 'finished', result: 'win' },
  { id: 6, type: 'simple', position: 4, player_name: 'Dubois', opponent_name: 'Davis', score: 0, thru: 0, status: 'not_started', result: null },
  { id: 7, type: 'simple', position: 5, player_name: 'Rousseau', opponent_name: 'Wilson', score: -2, thru: 18, status: 'finished', result: 'loss' },
]

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default function App() {
  const [competition, setCompetition] = useState(null)
  const [matches, setMatches] = useState([])
  const [editingMatch, setEditingMatch] = useState(null)
  const [showSetup, setShowSetup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isDemo = !supabase
  const params = new URLSearchParams(window.location.search)
  const code = params.get('c')
  const pinParam = params.get('pin')

  // Admin si le pin dans l'URL correspond
  const isAdmin = !!(competition && pinParam && pinParam === competition.admin_pin)

  useEffect(() => {
    if (isDemo) {
      setCompetition(demoCompetition)
      setMatches(demoMatches)
      setLoading(false)
      return
    }

    if (!code) {
      setShowSetup(true)
      setLoading(false)
      return
    }

    loadCompetition(code)
  }, [])

  useEffect(() => {
    if (isDemo || !competition) return

    const channel = supabase
      .channel(`comp-${competition.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `competition_id=eq.${competition.id}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setMatches((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new : m)))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [competition, isDemo])

  async function loadCompetition(code) {
    try {
      const { data: comp, error: compError } = await supabase
        .from('competitions')
        .select('*')
        .eq('code', code)
        .single()

      if (compError || !comp) {
        setError('Compétition introuvable')
        setLoading(false)
        return
      }

      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .eq('competition_id', comp.id)
        .order('type')
        .order('position')

      setCompetition(comp)
      setMatches(matchData || [])
    } catch {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  async function handleCreateCompetition(formData) {
    const competitionCode = generateCode()

    const { data: comp, error: compError } = await supabase
      .from('competitions')
      .insert({
        code: competitionCode,
        name: formData.name,
        date: formData.date,
        team_name: formData.teamName,
        opponent_name: formData.opponentName,
        admin_pin: formData.pin,
      })
      .select()
      .single()

    if (compError) {
      alert('Erreur: ' + compError.message)
      return
    }

    const matchesToCreate = [
      ...Array.from({ length: 2 }, (_, i) => ({
        competition_id: comp.id,
        type: 'double',
        position: i + 1,
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        competition_id: comp.id,
        type: 'simple',
        position: i + 1,
      })),
    ]

    const { data: createdMatches } = await supabase.from('matches').insert(matchesToCreate).select()

    window.history.pushState({}, '', `?c=${competitionCode}&pin=${formData.pin}`)
    setCompetition(comp)
    setMatches(createdMatches || [])
    setShowSetup(false)
  }

  async function handleUpdateMatch(matchId, data) {
    if (isDemo) {
      setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, ...data } : m)))
      setEditingMatch(null)
      return
    }

    const { error: updateError } = await supabase.from('matches').update(data).eq('id', matchId)

    if (updateError) {
      alert('Erreur: ' + updateError.message)
      return
    }
    setEditingMatch(null)
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-mesh flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-8 text-center max-w-sm animate-fade-in-up">
          <p className="text-2xl mb-3">⛳</p>
          <h2 className="text-white font-bold text-lg mb-2">{error}</h2>
          <p className="text-white/40 text-sm mb-6">Vérifiez le lien ou créez une nouvelle compétition.</p>
          <button
            onClick={() => {
              window.history.pushState({}, '', window.location.pathname)
              setError(null)
              setShowSetup(true)
            }}
            className="px-6 py-3 rounded-2xl bg-gold hover:bg-gold-light text-black font-bold text-sm transition-all"
          >
            Nouvelle compétition
          </button>
        </div>
      </div>
    )
  }

  if (showSetup) {
    return <SetupForm onCreate={handleCreateCompetition} />
  }

  return (
    <>
      <Scoreboard
        competition={competition}
        matches={matches}
        isAdmin={isAdmin}
        isDemo={isDemo}
        onEditMatch={setEditingMatch}
      />
      {editingMatch && (
        <EditMatchModal match={editingMatch} onSave={handleUpdateMatch} onClose={() => setEditingMatch(null)} />
      )}
    </>
  )
}
