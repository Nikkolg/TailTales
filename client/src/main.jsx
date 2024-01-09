import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LogIn } from './pages/LogIn/index.jsx';
import { Registration } from './pages/Registration/index.jsx';
import { HomePage } from './pages/Home/index.jsx';



const router = createBrowserRouter([
  {
    index: true,
    element: <App />
  },
  {
    path: "auth",
    element: <LogIn />
  },
  {
    path: "registration",
    element: <Registration />
  },
  {
    path: "home",
    element: <HomePage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
