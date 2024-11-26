import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.scss'
import { Provider } from 'react-redux'
import { BrowserRouter} from 'react-router-dom'
import { store } from './core/store/store'
import { AppRoute } from './components/_Layout/app.route'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ModalProvider } from './context/signIn_modal_context'


createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
  <StrictMode>
    <ModalProvider>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </Provider>
    </ModalProvider>
  </StrictMode>
  </I18nextProvider>
)
