import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Page from './Page'
import { AuthUserProvider } from './AuthUserContext'
import ErrorBoundary from './ErrorBoundary'
import initializeSocket from './utils/socket-client'
import { UserStatusProvider } from './UserStatusContext'

function App() {
  useEffect(() => {
    const socket = initializeSocket();

    return () => socket?.disconnect();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <AuthUserProvider>
          <UserStatusProvider>
            <BrowserRouter>
              <Page />
            </BrowserRouter>
          </UserStatusProvider>
        </AuthUserProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
