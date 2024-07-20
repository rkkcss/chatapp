import { Route, Routes } from 'react-router'
import './App.css'
import { Login } from './pages/Login'
import { Layout } from './pages/Layout'
import { ChatLayout } from './pages/ChatLayout'
import { ProtectedRoutes } from './components/ProtectedRoutes'
import { Logout } from './pages/Logout'
import { Chat } from './components/Chat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />}></Route>
      <Route path="/logout" element={<Logout />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/chat" element={<ChatLayout />}>
            <Route path=":roomId" element={<Chat />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
