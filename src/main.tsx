import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App'
import { AppSettingsProvider } from './context/AppSettings'
import { initAnalytics } from './lib/analytics'
import { recordGlobalVisit } from './lib/global-metrics'

initAnalytics()
recordGlobalVisit()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <App />
      <Analytics />
    </AppSettingsProvider>
  </StrictMode>,
)
