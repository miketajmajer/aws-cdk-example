import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
} else {
  alert('No root element found');
}
