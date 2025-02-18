import '../src/App.css'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { MainPage } from './pages/MainPage'
import  ChatPage   from './pages/ChatPage'
import  PostPage  from './pages/PostPage'
import  AddPostPage  from './pages/AddPostPage'
import {ForgotPassword} from './pages/ForgotPassword.jsx'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { EditPostPage } from './pages/EditPostPage'
import { ToastContainer } from 'react-toastify'
import { VerifyPage } from './pages/VerifyPage';
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover={false}
                draggable
                style={{
                    width: "max-content",
                    minWidth: "200px",
                    maxWidth: "300px",
                    right: "20px",
                    left: "unset",
                }}
                toastStyle={{
                    borderRadius: "4px",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "500",
                    padding: "10px 15px",
                    wordWrap: "break-word",
                    textAlign: "center",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                progressStyle={{
                    backgroundColor: "#ff4d4d",
                    height: "3px",
                    width: "100%",
                    borderRadius: "2px",
                }}
            />

            <Routes>
                {/* Страницы без Layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Страницы внутри Layout */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<MainPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path=":id" element={<PostPage />} />
                    <Route path=":id/edit" element={<EditPostPage />} />
                    <Route path="new" element={<AddPostPage />} />
                </Route>
            </Routes>
        </>
    )
}

export default App;