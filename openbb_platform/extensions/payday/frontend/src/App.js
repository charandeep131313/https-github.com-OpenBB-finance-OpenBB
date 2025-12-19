import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Refer from './Refer';
import ApplicationForm from './ApplicationForm';
import LoanStatus from './LoanStatus';
import AdminDashboard from './AdminDashboard';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/apply">Apply for a Loan</Link>
                        </li>
                        <li>
                            <Link to="/status">Loan Status</Link>
                        </li>
                        <li>
                            <Link to="/refer">Refer a Friend</Link>
                        </li>
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/apply" element={<ApplicationForm />} />
                    <Route path="/status" element={<LoanStatus />} />
                    <Route path="/refer" element={<Refer />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
