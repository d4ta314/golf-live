import { Pencil } from 'lucide-react'

function getScoreDisplay(match) {
  if (match.status === 'not_started') {
    return { text: '—', colorClass: 'bg-white/5 border-white/10 text-white/30' }
  }

  if (match.status === 'finished') {
    if (match.result === 'halved') {
      return { text: '½', colorClass: 'bg-white/10 border-white/20 text-white/60' }
    }
    const absScore = Math.abs(match.score)
    const remaining = 18 - match.thru
    const isWin = match.result === 'win'
    const text = remaining > 0 ? `${absScore} & ${remaining}` : `${absScore} ${isWin ? 'UP' : 'DN'}`
    return {
      text,
      colorClass: isWin
        ? 'bg-emerald-400/15 border-emerald-400/30 text-emerald-400'
        : 'bg-red-400/15 border-red-400/30 text-red-400',
    }
  }

  // In progress
  if (match.score > 0) {
    return { text: `${match.score} UP`, colorClass: 'bg-emerald-400/15 border-emerald-400/30 text-emerald-400' }
  }
  if (match.score < 0) {
    return { text: `${Math.abs(match.score)} DN`, colorClass: 'bg-red-400/15 border-red-400/30 text-red-400' }
  }
  return { text: 'AS', colorClass: 'bg-blue-400/15 border-blue-400/30 text-blue-400' }
}

function getBorderColor(match) {
  if (match.status === 'not_started') return 'border-l-white/10'
  if (match.status === 'in_progress') return 'border-l-blue-400'
  if (match.result === 'win') return 'border-l-emerald-400'
  if (match.result === 'loss') return 'border-l-red-400/60'
  return 'border-l-white/20'
}

function getStatusInfo(match) {
  if (match.status === 'not_started') {
    return { label: 'À venir', dotClass: 'bg-white/20', labelClass: 'text-white/30' }
  }
  if (match.status === 'in_progress') {
    return { label: 'En cours', dotClass: 'bg-blue-400 animate-pulse-live', labelClass: 'text-blue-400' }
  }
  if (match.result === 'win') return { label: 'Victoire', dotClass: 'bg-emerald-400', labelClass: 'text-emerald-400' }
  if (match.result === 'loss') return { label: 'Défaite', dotClass: 'bg-red-400/60', labelClass: 'text-red-400/60' }
  return { label: 'Partagé', dotClass: 'bg-white/40', labelClass: 'text-white/40' }
}

export default function MatchCard({ match, isAdmin, onEdit, animDelay = 0 }) {
  const score = getScoreDisplay(match)
  const border = getBorderColor(match)
  const status = getStatusInfo(match)

  return (
    <div
      className={`glass rounded-2xl p-5 border-l-4 ${border} transition-all duration-300 animate-fade-in-up`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${status.labelClass}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {match.status === 'in_progress' && match.thru > 0 && (
            <span className="text-xs text-white/40 font-medium">Trou {match.thru}</span>
          )}
          {isAdmin && (
            <button
              onClick={() => onEdit(match)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-white font-semibold text-base leading-tight">
          {match.player_name || 'Joueur(s) à définir'}
        </p>
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.25em] my-1.5">vs</p>
        <p className="text-white/50 font-medium text-sm leading-tight">
          {match.opponent_name || 'Adversaire à définir'}
        </p>
      </div>

      <div className="flex justify-center">
        <span
          className={`score-badge inline-block px-5 py-2 rounded-full border font-bold text-lg ${score.colorClass}`}
        >
          {score.text}
        </span>
      </div>
    </div>
  )
}
