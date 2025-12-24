import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';

const CompleteRegistration = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (data.message === 'Token is valid.') {
                setIsValidToken(true);
            } else {
                setError(data.message);
            }
        };
        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/complete-registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(data.message);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Complete Registration
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {message ? (
                <Typography>{message}</Typography>
            ) : isValidToken ? (
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
                    </Button>
                </form>
            ) : (
                <Typography>Verifying your token...</Typography>
            )}
        </Container>
    );
};

export default CompleteRegistration;
