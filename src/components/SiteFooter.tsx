import { SITE } from '../config/site'
import { useAppSettings } from '../context/AppSettings'

export default function SiteFooter() {
  const { t } = useAppSettings()

  return (
    <footer className="mt-auto border-t divider-iz py-6 px-4 text-center text-xs text-iz-muted">
      <p className="mb-2">{t('footer.tagline')}</p>
      <p className="mb-4 font-heading">
        {t('footer.byBefore')}
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-iz-cyan hover:text-iz-orange transition-colors"
        >
          {SITE.author}
        </a>
      </p>

      <a
        href={SITE.paypal}
        target="_blank"
        rel="noopener noreferrer"
        className="text-iz-orange hover:text-iz-orange-light transition-colors font-heading font-bold"
      >
        ☕ {t('footer.support')} ↗
      </a>
    </footer>
  )
}
