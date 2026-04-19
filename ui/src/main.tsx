import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize MSW (Mock Service Worker)
async function startApp() {
  try {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  } catch (error) {
    console.error('Failed to start MSW:', error)
  }

  // Render React app
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root element not found')
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

startApp().catch((error) => {
  console.error('Failed to start app:', error)
})
