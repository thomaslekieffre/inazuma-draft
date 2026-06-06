import { SITE } from '../config/site'
import { useAppSettings } from '../context/AppSettings'

interface Props {
  variant?: 'inline' | 'rail'
  className?: string
}

export default function AdSlot({ variant = 'inline', className = '' }: Props) {
  const { t } = useAppSettings()

  return (
    <a
      href={SITE.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variant === 'rail' ? 'ad-slot ad-slot--rail' : 'ad-slot'} ${className}`.trim()}
    >
      <span className="font-heading font-bold text-iz-cyan ad-slot__title">{t('footer.adSlot')}</span>
      <span className="text-[10px] text-iz-muted mt-1 leading-tight text-center">{t('footer.adContact')}</span>
    </a>
  )
}
