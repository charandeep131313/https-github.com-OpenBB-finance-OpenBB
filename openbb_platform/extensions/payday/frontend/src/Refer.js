import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const Refer = () => {
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        const fetchReferralCode = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/referral_code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 1 }), // This should be replaced with the actual user ID
            });
            const data = await response.json();
            setReferralCode(data.referral_code);
        };
        fetchReferralCode();
    }, []);

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Refer a Friend
            </Typography>
            <Typography variant="body1" gutterBottom>
                Share your referral code with your friends and you'll both get a reward!
            </Typography>
            <TextField
                label="Your Referral Code"
                fullWidth
                margin="normal"
                value={referralCode}
                InputProps={{
                    readOnly: true,
                }}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigator.clipboard.writeText(referralCode)}
            >
                Copy to Clipboard
            </Button>
        </Container>
    );
};

export default Refer;
