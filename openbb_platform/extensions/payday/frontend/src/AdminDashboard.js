import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress } from '@mui/material';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [repayments, setRepayments] = useState([]);
    const [token, setToken] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        const headers = { 'X-Admin-Token': token };
        const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/users`, { method: 'POST', headers });
        if (usersResponse.ok) {
            setLoggedIn(true);
            fetchData();
        } else {
            setError('Invalid admin token');
        }
        setLoading(false);
    };

    const fetchData = async () => {
        const headers = { 'X-Admin-Token': token };
        const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/users`, { method: 'POST', headers });
        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData) ? usersData : []);

        const appsResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/applications`, { method: 'POST', headers });
        const appsData = await appsResponse.json();
        setApplications(Array.isArray(appsData) ? appsData : []);

        const repsResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/repayments`, { method: 'POST', headers });
        const repsData = await repsResponse.json();
        setRepayments(Array.isArray(repsData) ? repsData : []);
    };

    if (!loggedIn) {
        return (
            <Container maxWidth="xs">
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Login
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    label="Admin Token"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                Users
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                Loan Applications
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.id}</TableCell>
                                <TableCell>{app.user_id}</TableCell>
                                <TableCell>{app.full_name}</TableCell>
                                <TableCell>${app.loan_amount_requested}</TableCell>
                                <TableCell>{app.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                Repayments
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Application ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {repayments.map((rep) => (
                            <TableRow key={rep.id}>
                                <TableCell>{rep.id}</TableCell>
                                <TableCell>{rep.application_id}</TableCell>
                                <TableCell>${rep.amount}</TableCell>
                                <TableCell>{rep.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminDashboard;
