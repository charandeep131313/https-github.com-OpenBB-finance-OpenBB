import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress,
    Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { AuthContext } from './AuthContext';

const Repayments = () => {
    const { userId, authFetch } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState('');
    const [repayments, setRepayments] = useState([]);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fetching, setFetching] = useState(true);

    const fetchApplications = async () => {
        if (!userId) return;
        try {
            const response = await authFetch(`${process.env.REACT_APP_API_URL}/payday/user/applications`);
            if (response.ok) {
                const data = await response.json();
                setApplications(Array.isArray(data) ? data.filter(app => app.status === 'approved') : []);
            }
        } catch (err) {
            setError('An error occurred while fetching applications.');
        }
    };

    const fetchRepayments = async () => {
        if (!selectedApplication) return;
        setFetching(true);
        try {
            const response = await authFetch(`${process.env.REACT_APP_API_URL}/payday/repayments/${selectedApplication}`);
            if (response.ok) {
                const data = await response.json();
                setRepayments(Array.isArray(data) ? data : []);
            } else {
                setError('Failed to fetch repayments.');
            }
        } catch (err) {
            setError('An error occurred while fetching repayments.');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [userId]);

    useEffect(() => {
        fetchRepayments();
    }, [selectedApplication]);

    const handleRepayment = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0 || !selectedApplication) {
            setError('Please select an application and enter a valid amount.');
            return;
        }
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const response = await authFetch(`${process.env.REACT_APP_API_URL}/payday/repay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ application_id: selectedApplication, amount: parseFloat(amount) }),
            });
            if (response.ok) {
                setAmount('');
                fetchRepayments();
                setMessage('Repayment successful!');
            } else {
                const data = await response.json();
                setError(data.detail || 'Repayment failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Make a Repayment
                </Typography>
                <Box component="form" onSubmit={handleRepayment} sx={{ mt: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="application-select-label">Loan Application</InputLabel>
                                <Select
                                    labelId="application-select-label"
                                    value={selectedApplication}
                                    onChange={(e) => setSelectedApplication(e.target.value)}
                                >
                                    {applications.map(app => (
                                        <MenuItem key={app.id} value={app.id}>
                                            Application #{app.id} - Amount: ${app.loan_amount_requested}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="Repayment Amount"
                                type="number"
                                fullWidth
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5 }}>
                                {loading ? <CircularProgress size={24} /> : 'Make Repayment'}
                            </Button>
                        </Grid>
                    </Grid>
                    {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
                    {message && <Typography color="success.main" align="center" sx={{ mt: 2 }}>{message}</Typography>}
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Repayment History
                </Typography>
                {fetching ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
                ) : (
                    <List>
                        {repayments.length > 0 ? repayments.map((repayment) => (
                            <ListItem key={repayment.id} divider>
                                <ListItemText
                                    primary={`Amount: $${repayment.amount}`}
                                    secondary={`Date: ${new Date(repayment.date).toLocaleDateString()}`}
                                />
                            </ListItem>
                        )) : (
                            <Typography>No repayment history found for this application.</Typography>
                        )}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default Repayments;
