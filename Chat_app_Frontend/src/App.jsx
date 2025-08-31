import Navbar from './components/Navbar';

import HomePage from "./pages/HomePage";
import SignUpPages from './pages/SignUpPages';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './pages/VerifyEmailPage';


import { Routes, Route, Navigate } from 'react-router-dom';
import { axiosInstance } from './lib/axios';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';
import { useKeySetup } from '../src/hooks/useKeySetup';

import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';


const app = () => {
    useKeySetup(); // Initialize RSA keys
    const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
    const {theme} = useThemeStore();
    
    console.log({ onlineUsers });

    useEffect(() => {
        checkAuth();
    },[checkAuth])


console.log({authUser});

if(isCheckingAuth && !authUser) return (
        <div className="flex justify-center items-center h-screen">
            <Loader className="size-10 animate-spin" />
        </div>
);





return (

<div data-theme = {theme}>

    <Navbar />
    <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPages />: <Navigate to="/" /> } />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/verify-email' element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

    </Routes>
    <Toaster />
</div>
)
}; 
export default app;