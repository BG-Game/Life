import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    status: null,
};




// 🔹 Регистрация
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ fullName, username, phoneNumber, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/register', {
                fullName,
                username,
                phoneNumber,
                password,
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



// 🔹 Логин
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/login', { username, password });
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// 🔹 Проверка токена (авторизация)
export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/auth/me');
        console.log("🔥 Ответ сервера в getMe:", data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// 🔹 Верификация кода
export const verifyCode = createAsyncThunk(
    'auth/verifyCode',
    async ({ phoneNumber, verificationCode }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/verify', {
                phoneNumber,
                code: verificationCode,
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// 🔹 Загрузка текущего пользователя (если есть токен)
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Нет токена');

        const { data } = await axios.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔥 API /auth/me ответ:", data); // Теперь должен включать avatarUrl
        return data; 
    } catch (error) {
        console.log("❌ Ошибка в fetchUser:", error);
        return rejectWithValue(error.response?.data || 'Ошибка загрузки пользователя');
    }
});


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.status = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Регистрация
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = action.payload?.message || 'Ошибка регистрации';
                state.isLoading = false;
            })

            // 🔹 Логин
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = action.payload?.message || 'Ошибка входа';
                state.isLoading = false;
            })

            // 🔹 Проверка токена
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                console.log("✅ getMe.fulfilled, данные:", action.payload);
                state.isLoading = false;
                state.status = null;
                state.user = action.payload; // Убираем `?.user`, сервер уже возвращает `user`
            })
            .addCase(getMe.rejected, (state, action) => {
                console.log("❌ Ошибка в getMe:", action.payload);
                state.status = action.payload?.message || 'Ошибка авторизации';
                state.isLoading = false;
            })

            // 🔹 Верификация кода
            .addCase(verifyCode.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(verifyCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.status = action.payload?.message || 'Ошибка при верификации';
                state.isLoading = false;
            })

            // 🔹 Загрузка пользователя (fetchUser)
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            builder.addCase(fetchUser.fulfilled, (state, action) => {
                console.log("🔥 Данные пользователя после обновления:", action.payload);
                state.user = action.payload;
                state.isLoading = false;
            })
            
            .addCase(fetchUser.rejected, (state, action) => {
                console.log("❌ Ошибка в fetchUser:", action.payload);
                state.isLoading = false;
                state.status = action.payload || 'Ошибка загрузки данных пользователя';
                state.user = null;
                state.token = null;
            })

    },
});

export const checkIsAuth = (state) => Boolean(state.auth.token);

export const { logout } = authSlice.actions;
export default authSlice.reducer;
