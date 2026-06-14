import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Page from './Page'
import { AuthUserProvider } from './AuthUserContext'
import ErrorBoundary from './ErrorBoundary'
import { UserStatusProvider } from './UserStatusContext'

function App() {
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
