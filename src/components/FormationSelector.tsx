import { FORMATIONS, type FormationId } from '../lib/lineup'

interface Props {
  value: FormationId
  onChange: (id: FormationId) => void
  className?: string
}

export default function FormationSelector({ value, onChange, className = '' }: Props) {
  return (
    <div className={`flex flex-wrap gap-1.5 justify-center ${className}`}>
      {FORMATIONS.map(f => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={`fmt-btn ${value === f.id ? 'fmt-btn--active' : 'fmt-btn--idle'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
