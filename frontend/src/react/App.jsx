import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Page from './Page'
import { AuthUserProvider } from './AuthUserContext'
import ErrorBoundary from './ErrorBoundary'
import initializeSocket from './utils/socket-client'

function App() {
  useEffect(() => {
    initializeSocket();
  }, [])

  return (
    <>
      <ErrorBoundary>
        <AuthUserProvider>
          <BrowserRouter>
            <Page />
          </BrowserRouter>
        </AuthUserProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
