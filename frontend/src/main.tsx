import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { store } from './state/store/store.ts'
import { Provider } from 'react-redux'
import App from './App'

import './index.css'

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
