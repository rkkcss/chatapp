import { Route, Routes } from 'react-router'
import './App.css'
import { Login } from './pages/Login'
import { Layout } from './pages/Layout'
import { ChatLayout } from './pages/ChatLayout'
import { ProtectedRoutes } from './components/ProtectedRoutes'
import { Logout } from './pages/Logout'
import { Chat } from './components/Chat'
import { WebSocketProvider } from './contexts/WebSocketProvider'
import { Registration } from './pages/Registration'
import { Profile } from './pages/Profile'
import { AdminPage } from './pages/AdminPage'
import CreateChatRoom from './components/CreateChatRoom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/logout" element={<Logout />} />
      <Route element={<ProtectedRoutes />}>
        <Route
          element={
            <WebSocketProvider>
              <Layout />
            </WebSocketProvider>
          }
        >

          <Route path="/chat" element={<ChatLayout />}>
            <Route path=":roomId" element={<Chat />} />
            <Route path="new" element={<CreateChatRoom />} />
          </Route>
          <Route path="/profile/:login" element={<Profile />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
