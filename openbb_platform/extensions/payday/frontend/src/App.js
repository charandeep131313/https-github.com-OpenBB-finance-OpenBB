import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Register from './Register';
import Login from './Login';
import CompleteRegistration from './CompleteRegistration';
import ApplicationForm from './ApplicationForm';
import LoanStatus from './LoanStatus';
import AdminDashboard from './AdminDashboard';
import Repayments from './Repayments';
import Referral from './Referral';

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Payday Loans
                    </Typography>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/register">Register</Button>
                    <Button color="inherit" component={Link} to="/apply">Apply</Button>
                    <Button color="inherit" component={Link} to="/status">Status</Button>
                    <Button color="inherit" component={Link} to="/repayments">Repayments</Button>
                    <Button color="inherit" component={Link} to="/referral">Referral</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/complete-registration/:token" element={<CompleteRegistration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/apply" element={<ApplicationForm />} />
                    <Route path="/status" element={<LoanStatus />} />
                    <Route path="/repayments" element={<Repayments />} />
                    <Route path="/referral" element={<Referral />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
