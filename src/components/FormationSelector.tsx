import { useEffect, useId, useRef, useState } from 'react'
import { FORMATIONS, getFormation, type FormationId } from '../lib/lineup'
import { useAppSettings } from '../context/AppSettings'

interface Props {
  value: FormationId
  onChange: (id: FormationId) => void
  className?: string
  disabled?: boolean
}

export default function FormationSelector({ value, onChange, className = '', disabled }: Props) {
  const { t } = useAppSettings()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = getFormation(value)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function pick(id: FormationId) {
    onChange(id)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className={`fmt-select-wrap ${className}`}>
      <button
        type="button"
        className="fmt-select"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        <span className="truncate">{t(current.nameKey)} · {current.layout}</span>
        <span className="fmt-select__chev" aria-hidden>▾</span>
      </button>

      {open && (
        <ul id={listId} role="listbox" className="fmt-select-menu" aria-label={t('formation.choose')}>
          {FORMATIONS.map(f => {
            const selected = f.id === value
            return (
              <li key={f.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`fmt-select-option${selected ? ' fmt-select-option--active' : ''}`}
                  onClick={() => pick(f.id)}
                >
                  <span className="font-medium">{t(f.nameKey)}</span>
                  <span className="fmt-select-option__layout">{f.layout}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
