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
import { UsersProfile } from './pages/UsersProfile/index.jsx';
import { AllUsers } from './pages/AllUsers/index.jsx';

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
  },
  {
    path: "user/:userId",
    element: <UsersProfile />
  },
  {
    path: "allUsers",
    element: <AllUsers />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
