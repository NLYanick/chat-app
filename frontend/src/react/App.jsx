import Page from './Page'
import { BrowserRouter } from 'react-router-dom'
import { AuthUserProvider } from './AuthUserContext'
import ErrorBoundary from './ErrorBoundary'

function App() {
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
