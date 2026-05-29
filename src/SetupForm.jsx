import { useState } from 'react'
import { Flag, ArrowRight } from 'lucide-react'

export default function SetupForm({ onCreate }) {
  const [teamName, setTeamName] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!teamName.trim() || !opponentName.trim() || pin.length < 4) return
    setLoading(true)
    await onCreate({
      name: 'Championnat de France',
      date: new Date().toISOString().split('T')[0],
      teamName: teamName.trim(),
      opponentName: opponentName.trim(),
      pin,
    })
    setLoading(false)
  }

  return (
    <div className="min-h-dvh bg-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl glass-gold flex items-center justify-center mb-5">
            <Flag size={36} className="text-gold" />
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">Golf Live</h1>
          <p className="text-white/40 text-sm mt-1">Créer un tableau de scores</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-6 space-y-5">
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
              Votre équipe
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="ex: AS Golf Marseille"
              className="w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
              Équipe adverse
            </label>
            <input
              type="text"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              placeholder="ex: Golf de Saint-Cloud"
              className="w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
              Code admin (4 chiffres)
            </label>
            <input
              type="tel"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • •"
              className="w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl font-bold tracking-[0.3em] placeholder:text-white/20 focus:outline-none focus:border-gold/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!teamName.trim() || !opponentName.trim() || pin.length < 4 || loading}
            className="w-full py-4 rounded-2xl bg-gold/90 hover:bg-gold text-golf-900 font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-golf-900/30 border-t-golf-900 rounded-full animate-spin" />
            ) : (
              <>
                Créer la compétition
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Le lien sera partageable sur WhatsApp
        </p>
      </div>
    </div>
  )
}
