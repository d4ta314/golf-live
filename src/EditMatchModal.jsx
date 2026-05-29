import { useState } from 'react'
import { X, Minus, Plus, Save } from 'lucide-react'

export default function EditMatchModal({ match, onSave, onClose }) {
  const [playerName, setPlayerName] = useState(match.player_name)
  const [opponentName, setOpponentName] = useState(match.opponent_name)
  const [score, setScore] = useState(match.score)
  const [thru, setThru] = useState(match.thru)
  const [status, setStatus] = useState(match.status)
  const [result, setResult] = useState(match.result || '')
  const [showNames, setShowNames] = useState(false)

  function handleSave() {
    onSave(match.id, {
      player_name: playerName,
      opponent_name: opponentName,
      score,
      thru,
      status,
      result: status === 'finished' ? (result || null) : null,
    })
  }

  const scoreLabel = score > 0 ? `${score} UP` : score < 0 ? `${Math.abs(score)} DN` : 'AS'
  const scoreColor = score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-blue-400'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-strong rounded-t-3xl p-5 w-full max-w-md relative animate-slide-up max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-base">
              {match.type === 'double' ? 'Double' : 'Simple'} {match.position}
            </h2>
            <p className="text-white/40 text-xs mt-0.5">
              {playerName || '—'} vs {opponentName || '—'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40">
            <X size={20} />
          </button>
        </div>

        {/* Statut */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { value: 'not_started', label: 'À venir' },
            { value: 'in_progress', label: 'En cours' },
            { value: 'finished', label: 'Terminé' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                status === opt.value
                  ? 'bg-gold/15 border-gold/30 text-gold'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {status !== 'not_started' && (
          <>
            {/* Score */}
            <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Score</label>
            <div className="flex items-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => setScore(Math.max(-10, score - 1))}
                className="w-16 h-14 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center text-red-400 text-2xl font-bold active:scale-95 transition-transform"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className={`text-2xl font-black score-badge ${scoreColor}`}>{scoreLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => setScore(Math.min(10, score + 1))}
                className="w-16 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 text-2xl font-bold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>

            {/* Trou */}
            <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Trou</label>
            <div className="flex items-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => setThru(Math.max(1, thru - 1))}
                className="w-16 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-2xl font-bold active:scale-95 transition-transform"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-black text-white score-badge">{thru}</span>
              </div>
              <button
                type="button"
                onClick={() => setThru(Math.min(18, thru + 1))}
                className="w-16 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-2xl font-bold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>

            {/* Résultat (si terminé) */}
            {status === 'finished' && (
              <div className="mb-5">
                <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Résultat</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'win', label: 'Victoire', activeClass: 'bg-emerald-400/15 border-emerald-400/40 text-emerald-400' },
                    { value: 'loss', label: 'Défaite', activeClass: 'bg-red-400/15 border-red-400/40 text-red-400' },
                    { value: 'halved', label: 'Partagé', activeClass: 'bg-white/10 border-white/30 text-white/70' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setResult(opt.value)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        result === opt.value
                          ? opt.activeClass
                          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Noms (rétractable) */}
        <button
          type="button"
          onClick={() => setShowNames(!showNames)}
          className="w-full text-left text-white/25 text-[11px] font-medium mb-3 hover:text-white/40 transition-colors"
        >
          {showNames ? '▾ Masquer noms' : '▸ Modifier noms joueurs'}
        </button>
        {showNames && (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={match.type === 'double' ? 'Dupont / Martin' : 'Dupont'}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-all"
            />
            <input
              type="text"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              placeholder={match.type === 'double' ? 'Garcia / Lopez' : 'Garcia'}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-all"
            />
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-light text-black font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Save size={16} />
          Enregistrer
        </button>
      </div>
    </div>
  )
}
