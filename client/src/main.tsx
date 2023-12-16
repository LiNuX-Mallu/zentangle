import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './Router.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store/configStore.ts'
import * as process from 'process';

window.global = window;
window.process = process;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>,
)