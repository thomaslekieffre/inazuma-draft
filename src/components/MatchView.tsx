import type { MatchResult } from '../types'
import { displayTeamName } from '../data/team-names'
import { useAppSettings } from '../context/AppSettings'

interface Props {
  result: MatchResult
  highlightTeam?: string
}

export default function MatchView({ result, highlightTeam }: Props) {
  const { t } = useAppSettings()
  const label = (name: string) => displayTeamName(name)
  const [s1, s2] = result.score
  const winner = s1 > s2 ? 0 : s2 > s1 ? 1 : -1

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className={`text-center flex-1 ${winner === 0 ? 'text-accent' : 'text-iz-text'}`}>
          <div className="text-sm text-iz-muted mb-1 font-heading">{label(result.team1Name)}</div>
          <div className="text-4xl font-heading font-black">{s1}</div>
        </div>
        <div className="text-iz-cyan font-heading font-bold">—</div>
        <div className={`text-center flex-1 ${winner === 1 ? 'text-accent' : 'text-iz-text'}`}>
          <div className="text-sm text-iz-muted mb-1 font-heading">{label(result.team2Name)}</div>
          <div className="text-4xl font-heading font-black">{s2}</div>
        </div>
      </div>
      {result.events.length > 0 && (
        <div className="space-y-1 border-t divider-iz pt-3">
          {result.events.map((e, i) => {
            const teamName = e.team === 0 ? result.team1Name : result.team2Name
            const highlight = highlightTeam === teamName
            return (
              <div key={i} className={`text-sm flex gap-2 ${highlight ? 'text-hissatsu font-heading' : 'text-iz-muted'}`}>
                <span className="w-8 text-right tabular-nums">{e.minute}'</span>
                <span>⚽ {e.player}{e.move ? ` — ${e.move}` : ''}</span>
              </div>
            )
          })}
        </div>
      )}
      {result.events.length === 0 && (
        <div className="text-center text-iz-muted text-sm border-t divider-iz pt-3">{t('match.draw')}</div>
      )}
    </div>
  )
}
