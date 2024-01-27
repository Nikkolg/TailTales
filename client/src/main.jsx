import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux"
import { RegistrationPage } from './pages/Registration';
import { MainPage } from './pages/Main';
import { store } from './redux/store.js';




const router = createBrowserRouter([
  {
    index: true,
    element: <App />
  },
  {
    path: "registration",
    element: <RegistrationPage />
  },
  {
    path: "main",
    element: <MainPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
