import { useState, useMemo } from 'react'
import type { Player, MatchResult, GroupStanding } from '../types'
import { FFI_BLOCK_A, FFI_BLOCK_B } from '../data/ffi-teams'
import { simulateMatch, simulateGroupStage, simulateRemainingGroupMatches } from '../engine/sim'
import { useAppSettings } from '../context/AppSettings'
import MatchView from './MatchView'

type TourneyPhase = 'intro' | 'groups' | 'qualified' | 'eliminated' | 'semis' | 'final' | 'done'

interface Props {
  playerTeam: Player[]
  onEnd: (won: boolean) => void
}

const PLAYER_NAME = 'Inazuma Japan'

export default function Tournament({ playerTeam, onEnd }: Props) {
  const { t } = useAppSettings()
  const [phase, setPhase] = useState<TourneyPhase>('intro')
  const [matchIdx, setMatchIdx] = useState(0)
  const [currentMatch, setCurrentMatch] = useState<MatchResult | null>(null)
  const [playerMatches, setPlayerMatches] = useState<MatchResult[]>([])
  const [groupAStandings, setGroupAStandings] = useState<GroupStanding[] | null>(null)
  const [groupBStandings, setGroupBStandings] = useState<GroupStanding[] | null>(null)
  const [semiResult, setSemiResult] = useState<MatchResult | null>(null)
  const [finalResult, setFinalResult] = useState<MatchResult | null>(null)
  const [playerRank, setPlayerRank] = useState(0)
  const [resolvingGroup, setResolvingGroup] = useState(false)

  const blockA = useMemo(
    () => [
      { name: PLAYER_NAME, players: playerTeam },
      ...FFI_BLOCK_A.map(t => ({ name: t.name, players: t.players })),
    ],
    [playerTeam],
  )

  const blockB = useMemo(
    () => FFI_BLOCK_B.map(t => ({ name: t.name, players: t.players })),
    [],
  )

  const playerOpponents = useMemo(() => FFI_BLOCK_A, [])

  const wins = playerMatches.filter(m => m.score[0] > m.score[1]).length
  const losses = playerMatches.filter(m => m.score[0] < m.score[1]).length

  function playPlayerMatch(idx: number): MatchResult {
    const opp = playerOpponents[idx]
    return simulateMatch(playerTeam, opp.players, PLAYER_NAME, opp.name)
  }

  function startGroups() {
    setPhase('groups')
    setMatchIdx(0)
    setPlayerMatches([])
    setGroupAStandings(null)
    setCurrentMatch(null)
  }

  function runCurrentMatch() {
    const result = playPlayerMatch(matchIdx)
    setCurrentMatch(result)
    setPlayerMatches(prev => [...prev, result])
  }

  function finishGroupStage() {
    setResolvingGroup(true)
    const { standings } = simulateRemainingGroupMatches(blockA, playerMatches)
    setGroupAStandings(standings)
    const rank = standings.findIndex(s => s.teamName === PLAYER_NAME) + 1
    setPlayerRank(rank)
    setResolvingGroup(false)
    if (rank <= 2) {
      const { standings: bStandings } = simulateGroupStage(blockB)
      setGroupBStandings(bStandings)
      setPhase('qualified')
    } else {
      setPhase('eliminated')
    }
  }

  function nextGroupMatch() {
    if (!currentMatch) return
    const next = matchIdx + 1
    if (next >= playerOpponents.length) {
      finishGroupStage()
      return
    }
    setMatchIdx(next)
    setCurrentMatch(null)
  }

  function playSemi() {
    if (!groupBStandings) return
    const b2 = groupBStandings[1]?.teamName ?? groupBStandings[0].teamName
    const opponent = blockB.find(t => t.name === b2) ?? blockB[0]
    const result = simulateMatch(playerTeam, opponent.players, PLAYER_NAME, opponent.name)
    setSemiResult(result)
    setPhase('semis')
  }

  function playFinal() {
    if (!groupBStandings) return
    const b1 = groupBStandings[0].teamName
    const opponent = blockB.find(t => t.name === b1) ?? FFI_BLOCK_B[0]
    const result = simulateMatch(playerTeam, opponent.players, PLAYER_NAME, opponent.name)
    setFinalResult(result)
    setPhase('final')
  }

  function finishTournament() {
    if (!finalResult) return
    setPhase('done')
    onEnd(finalResult.score[0] > finalResult.score[1])
  }

  const wonSemi = semiResult && semiResult.score[0] > semiResult.score[1]
  const lostSemi = semiResult && semiResult.score[0] <= semiResult.score[1]

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl font-bold mb-6 text-iz-heading">
          {t('tournament.title')} <span className="text-accent">{t('tournament.place')}</span>
        </h2>

        {phase === 'intro' && (
          <div className="animate-fade-in text-center">
            <p className="text-iz-text mb-6">{t('tournament.intro')}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <TeamList title={t('tournament.blocA')} teams={[PLAYER_NAME, ...FFI_BLOCK_A.map(t => t.name)]} highlight={PLAYER_NAME} />
              <TeamList title={t('tournament.blocB')} teams={FFI_BLOCK_B.map(t => `${t.flag} ${t.name}`)} />
            </div>
            <button type="button" onClick={startGroups} className="btn-primary">{t('tournament.start')}</button>
          </div>
        )}

        {phase === 'groups' && (
          <div className="animate-fade-in">
            <p className="text-sm text-iz-cyan mb-4 font-heading">
              {t('tournament.group', { current: matchIdx + 1, total: playerOpponents.length })}
              {playerMatches.length > 0 && (
                <span className="text-iz-muted ml-2">
                  {t('tournament.record', { wins, losses })}
                </span>
              )}
            </p>

            {!currentMatch ? (
              <div className="card p-6 text-center">
                <p className="text-iz-text mb-2 font-heading text-lg">
                  {t('tournament.vs', { home: PLAYER_NAME, away: playerOpponents[matchIdx].name })}
                </p>
                <p className="text-iz-muted text-sm mb-6">{playerOpponents[matchIdx].flag} {playerOpponents[matchIdx].country}</p>
                <button type="button" onClick={runCurrentMatch} className="btn-primary w-full">
                  {t('tournament.playMatch')}
                </button>
              </div>
            ) : (
              <>
                <MatchView result={currentMatch} highlightTeam={PLAYER_NAME} />
                <button
                  type="button"
                  onClick={nextGroupMatch}
                  disabled={resolvingGroup}
                  className="btn-primary mt-6 w-full"
                >
                  {resolvingGroup
                    ? t('tournament.resolving')
                    : matchIdx + 1 >= playerOpponents.length
                      ? t('tournament.closeGroup')
                      : t('tournament.nextMatch')}
                </button>
              </>
            )}
          </div>
        )}

        {phase === 'qualified' && groupAStandings && groupBStandings && (
          <div className="animate-fade-in text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-heading text-2xl font-bold text-inazuma mb-2">{t('tournament.qualified')}</h3>
            <p className="text-iz-muted mb-2">{t('tournament.qualifiedHint', { rank: playerRank })}</p>
            <StandingsTable title={t('tournament.standingsA')} standings={groupAStandings} highlight={PLAYER_NAME} />
            <StandingsTable title={t('tournament.standingsB')} standings={groupBStandings} className="mt-4" />
            <button type="button" onClick={playSemi} className="btn-primary mt-6">{t('tournament.semiBtn')}</button>
          </div>
        )}

        {phase === 'eliminated' && groupAStandings && (
          <div className="animate-fade-in text-center">
            <h3 className="font-heading text-2xl font-bold text-red-400 mb-4">{t('tournament.eliminated')}</h3>
            <p className="text-iz-muted mb-4">{t('tournament.eliminatedHint', { rank: playerRank })}</p>
            <StandingsTable title={t('tournament.standingsAFinal')} standings={groupAStandings} highlight={PLAYER_NAME} />
            <button type="button" onClick={() => onEnd(false)} className="btn-secondary mt-6">{t('tournament.finish')}</button>
          </div>
        )}

        {phase === 'semis' && semiResult && (
          <div className="animate-fade-in">
            <p className="text-sm text-iz-cyan mb-4 font-heading">{t('tournament.semi')}</p>
            <MatchView result={semiResult} highlightTeam={PLAYER_NAME} />
            {wonSemi && (
              <button type="button" onClick={playFinal} className="btn-primary mt-6 w-full">{t('tournament.finalBtn')}</button>
            )}
            {lostSemi && (
              <>
                <p className="text-red-400 text-center mt-6 font-heading">{t('tournament.semiOut')}</p>
                <button type="button" onClick={() => onEnd(false)} className="btn-secondary mt-6 w-full">{t('tournament.finish')}</button>
              </>
            )}
          </div>
        )}

        {phase === 'final' && finalResult && (
          <div className="animate-fade-in">
            <h3 className="font-heading text-3xl font-black text-inazuma text-center mb-6">🏆 {t('tournament.final')}</h3>
            <MatchView result={finalResult} highlightTeam={PLAYER_NAME} />
            <button type="button" onClick={finishTournament} className="btn-primary mt-6 w-full">{t('tournament.seeResult')}</button>
          </div>
        )}

        {phase === 'done' && finalResult && (
          <div className="animate-fade-in text-center">
            {finalResult.score[0] > finalResult.score[1] ? (
              <h3 className="font-heading text-4xl font-black text-inazuma">{t('tournament.champion')}</h3>
            ) : (
              <>
                <h3 className="font-heading text-3xl font-bold text-red-400">{t('tournament.finalLoss')}</h3>
                <button type="button" onClick={() => onEnd(false)} className="btn-secondary mt-6">{t('tournament.finish')}</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TeamList({ title, teams, highlight }: { title: string; teams: string[]; highlight?: string }) {
  return (
    <div className="card p-3 text-left">
      <h4 className="font-heading text-xs text-iz-cyan uppercase mb-2 font-bold">{title}</h4>
      <ul className="text-xs space-y-1">
        {teams.map(t => (
          <li key={t} className={t === highlight ? 'text-accent font-bold' : 'text-iz-text'}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

function StandingsTable({
  title,
  standings,
  highlight,
  className = '',
}: {
  title: string
  standings: GroupStanding[]
  highlight?: string
  className?: string
}) {
  const { t } = useAppSettings()

  return (
    <div className={`card p-3 text-left ${className}`}>
      <h4 className="font-heading text-xs text-iz-cyan uppercase mb-2 font-bold">{title}</h4>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-iz-muted">
            <th className="text-left py-1">#</th>
            <th className="text-left">{t('tournament.team')}</th>
            <th>{t('tournament.pts')}</th>
            <th>{t('tournament.diff')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.teamName} className={s.teamName === highlight ? 'text-accent font-bold' : 'text-iz-text'}>
              <td className="py-1">{i + 1}</td>
              <td>{s.teamName}</td>
              <td className="text-center">{s.points}</td>
              <td className="text-center">{s.gf - s.ga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
