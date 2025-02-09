import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice' // Исправленный импорт

export const store = configureStore ({
    reducer: {
        auth: authReducer, // Используем reducer, а не весь slice
    },
})
