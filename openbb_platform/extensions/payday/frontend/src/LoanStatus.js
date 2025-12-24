import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, TextField } from '@mui/material';
import { useAuth } from './AuthContext';

const LoanStatus = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [repaymentAmount, setRepaymentAmount] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            if (user) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/user/applications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user.id }),
                });
                const data = await response.json();
                setApplications(data);
            }
        };
        fetchApplications();
    }, [user]);

    const handleRepayment = async (applicationId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/repay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: applicationId, amount: repaymentAmount }),
        });
        const data = await response.json();
        console.log(data);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Loan Status
            </Typography>
            {applications.map((app) => (
                <Card key={app.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Application #{app.id}</Typography>
                        <Typography>Amount: ${app.loan_amount_requested}</Typography>
                        <Typography>Status: {app.status}</Typography>
                        {app.status === 'approved' && (
                            <div>
                                <TextField
                                    label="Repayment Amount"
                                    type="number"
                                    value={repaymentAmount}
                                    onChange={(e) => setRepaymentAmount(e.target.value)}
                                    sx={{ mt: 2, mr: 1 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleRepayment(app.id)}
                                    sx={{ mt: 2 }}
                                >
                                    Make Repayment
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default LoanStatus;
