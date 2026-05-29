import { Flag, Trophy, Pencil } from 'lucide-react'

function getScoreDisplay(match) {
  if (match.status === 'not_started') return { text: '—', cls: 'text-white/20' }
  if (match.status === 'finished') {
    if (match.result === 'halved') return { text: '½', cls: 'text-white/50' }
    const abs = Math.abs(match.score)
    const rem = 18 - match.thru
    const isWin = match.result === 'win'
    const text = rem > 0 ? `${abs}&${rem}` : `${abs}${isWin ? 'UP' : 'DN'}`
    return { text, cls: isWin ? 'text-emerald-400' : 'text-red-400' }
  }
  if (match.score > 0) return { text: `${match.score}UP`, cls: 'text-emerald-400' }
  if (match.score < 0) return { text: `${Math.abs(match.score)}DN`, cls: 'text-red-400' }
  return { text: 'AS', cls: 'text-blue-400' }
}

function getStatusDot(match) {
  if (match.status === 'not_started') return 'bg-white/15'
  if (match.status === 'in_progress') return 'bg-blue-400 animate-pulse-live'
  if (match.result === 'win') return 'bg-emerald-400'
  if (match.result === 'loss') return 'bg-red-400/60'
  return 'bg-white/30'
}

function MatchRow({ match, isAdmin, onEdit, isLast }) {
  const score = getScoreDisplay(match)
  const dot = getStatusDot(match)

  return (
    <div className={`flex items-center py-2.5 px-3 ${!isLast ? 'border-b border-white/[0.04]' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 ${dot}`} />
      <span className="flex-1 text-white/80 text-[13px] font-medium truncate">
        {match.player_name || '—'}
      </span>
      <span className={`score-badge text-[13px] font-bold min-w-[40px] text-right ${score.cls}`}>
        {score.text}
      </span>
      {match.status === 'in_progress' && match.thru > 0 ? (
        <span className="text-[11px] text-white/25 font-medium w-8 text-right ml-1">T{match.thru}</span>
      ) : (
        <span className="w-8 ml-1" />
      )}
      {isAdmin && (
        <button
          onClick={() => onEdit(match)}
          className="ml-1 p-1 rounded text-white/20 hover:text-white/60 transition-colors"
        >
          <Pencil size={11} />
        </button>
      )}
    </div>
  )
}

function TeamScore({ competition, matches }) {
  let teamPts = 0, oppPts = 0, live = 0
  matches.forEach((m) => {
    if (m.status === 'finished') {
      if (m.result === 'win') teamPts += 1
      else if (m.result === 'loss') oppPts += 1
      else if (m.result === 'halved') { teamPts += 0.5; oppPts += 0.5 }
    } else if (m.status === 'in_progress') live++
  })
  const fmt = (n) => (n % 1 === 0 ? n.toString() : n.toFixed(1))

  return (
    <div className="glass-gold rounded-2xl px-5 py-4 mb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gold text-[11px] font-bold uppercase tracking-wider truncate flex-1">{competition.team_name}</p>
        <Trophy size={14} className="text-gold/40 mx-2 flex-shrink-0" />
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider truncate flex-1 text-right">{competition.opponent_name}</p>
      </div>
      <div className="flex items-baseline justify-center gap-3 mb-3">
        <span className="text-4xl font-black text-gold score-badge">{fmt(teamPts)}</span>
        <span className="text-lg text-white/15 font-bold">—</span>
        <span className="text-4xl font-black text-white/50 score-badge">{fmt(oppPts)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex mb-2">
        <div className="h-full bg-gradient-to-r from-gold/80 to-gold rounded-l-full transition-all duration-700" style={{ width: `${(teamPts / 7) * 100}%` }} />
        <div className="h-full flex-1" />
        <div className="h-full bg-white/15 rounded-r-full transition-all duration-700" style={{ width: `${(oppPts / 7) * 100}%` }} />
      </div>
      <p className="text-center text-white/25 text-[10px] font-medium">
        {live > 0 ? `${live} en cours` : 'Terminé'} · 7 matchs
      </p>
    </div>
  )
}

function MatchGroup({ label, matches, isAdmin, onEdit }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5 px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold/40">{label}</span>
        <div className="h-px flex-1 bg-gold/10" />
      </div>
      <div className="glass rounded-xl overflow-hidden">
        {matches.map((m, i) => (
          <MatchRow key={m.id} match={m} isAdmin={isAdmin} onEdit={onEdit} isLast={i === matches.length - 1} />
        ))}
      </div>
    </div>
  )
}

export default function Scoreboard({ competition, matches, isAdmin, isDemo, onEditMatch }) {
  const doubles = matches.filter((m) => m.type === 'double').sort((a, b) => a.position - b.position)
  const singles = matches.filter((m) => m.type === 'simple').sort((a, b) => a.position - b.position)

  const dateStr = new Date(competition.date + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="min-h-dvh bg-mesh">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Header compact */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Flag size={12} className="text-gold/50" />
              <span className="text-gold/50 text-[10px] font-bold uppercase tracking-[0.15em]">Golf Live</span>
              {isDemo && (
                <span className="text-blue-400/60 text-[9px] font-medium ml-1">· démo</span>
              )}
            </div>
            <h1 className="text-white font-bold text-sm leading-tight">{competition.name}</h1>
            <p className="text-white/25 text-[11px] capitalize">{dateStr}</p>
          </div>
          {isAdmin && (
            <span className="text-[9px] text-gold/40 font-medium px-2 py-1 rounded-lg bg-gold/5 border border-gold/10">Admin</span>
          )}
        </div>

        {/* Team Score */}
        <TeamScore competition={competition} matches={matches} />

        {/* Matches */}
        <MatchGroup label="Doubles · Matin" matches={doubles} isAdmin={isAdmin} onEdit={onEditMatch} />
        <MatchGroup label="Simples · Après-midi" matches={singles} isAdmin={isAdmin} onEdit={onEditMatch} />

      </div>
    </div>
  )
}
