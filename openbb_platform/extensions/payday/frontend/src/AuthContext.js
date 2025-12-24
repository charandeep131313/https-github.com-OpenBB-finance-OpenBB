import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                // Make sure to fetch the user ID from the decoded token
                // The key depends on what you set in the backend's `create_access_token` function
                const userIdFromToken = decoded.user_id;
                setUserId(userIdFromToken);
                setUser({ username: decoded.sub });
                setToken(storedToken);
            } catch (error) {
                console.error("Failed to decode token", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        try {
            const decoded = jwtDecode(newToken);
            const userIdFromToken = decoded.user_id;
            setUserId(userIdFromToken);
            setUser({ username: decoded.sub });
            setToken(newToken);
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setUserId(null);
    };

    const authFetch = async (url, options = {}) => {
        const currentToken = localStorage.getItem('token');
        const finalOptions = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${currentToken}`,
            },
        };
        return fetch(url, finalOptions);
    };

    return (
        <AuthContext.Provider value={{ user, userId, token, login, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
