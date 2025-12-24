import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';

const Register = () => {
    const [email, setEmail] = useState('');
    const [referredBy, setReferredBy] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, referred_by: referredBy }),
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
        } else {
            setError(data.message);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {message ? (
                <Typography>{message}</Typography>
            ) : (
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Referral Code (Optional)"
                        fullWidth
                        margin="normal"
                        value={referredBy}
                        onChange={(e) => setReferredBy(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </form>
            )}
        </Container>
    );
};

export default Register;
