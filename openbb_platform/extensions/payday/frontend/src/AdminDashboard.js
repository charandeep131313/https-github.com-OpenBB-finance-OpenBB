import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [repayments, setRepayments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/users`, { method: 'POST' });
            const usersData = await usersResponse.json();
            setUsers(usersData.results);

            const appsResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/applications`, { method: 'POST' });
            const appsData = await appsResponse.json();
            setApplications(appsData.results);

            const repsResponse = await fetch(`${process.env.REACT_APP_API_URL}/payday/repayments`, { method: 'POST' });
            const repsData = await repsResponse.json();
            setRepayments(repsData.results);
        };
        fetchData();
    }, []);

    const handleApprove = async (applicationId, approved) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: applicationId, approved }),
        });
        const data = await response.json();
        console.log(data);
    };

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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>
                                    {app.status === 'pending' && (
                                        <>
                                            <Button variant="contained" color="primary" onClick={() => handleApprove(app.id, true)}>
                                                Approve
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleApprove(app.id, false)} sx={{ ml: 1 }}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
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
