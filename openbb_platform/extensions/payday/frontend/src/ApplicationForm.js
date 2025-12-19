import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Personal Information', 'Financial Information', 'Loan Details'];

const ApplicationForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        full_name: '',
        address: '',
        date_of_birth: '',
        social_insurance_number: '',
        employment_status: '',
        monthly_income: '',
        loan_amount_requested: '',
        loan_purpose: '',
    });

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/payday/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, user_id: 1 }), // This should be replaced with the actual user ID
        });
        const data = await response.json();
        console.log(data);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <TextField name="full_name" label="Full Name" fullWidth margin="normal" value={formData.full_name} onChange={handleChange} />
                        <TextField name="address" label="Address" fullWidth margin="normal" value={formData.address} onChange={handleChange} />
                        <TextField name="date_of_birth" label="Date of Birth" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.date_of_birth} onChange={handleChange} />
                        <TextField name="social_insurance_number" label="Social Insurance Number" fullWidth margin="normal" value={formData.social_insurance_number} onChange={handleChange} />
                    </>
                );
            case 1:
                return (
                    <>
                        <TextField name="employment_status" label="Employment Status" fullWidth margin="normal" value={formData.employment_status} onChange={handleChange} />
                        <TextField name="monthly_income" label="Monthly Income" type="number" fullWidth margin="normal" value={formData.monthly_income} onChange={handleChange} />
                    </>
                );
            case 2:
                return (
                    <>
                        <TextField name="loan_amount_requested" label="Loan Amount Requested" type="number" fullWidth margin="normal" value={formData.loan_amount_requested} onChange={handleChange} />
                        <TextField name="loan_purpose" label="Loan Purpose" fullWidth margin="normal" value={formData.loan_purpose} onChange={handleChange} />
                    </>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Loan Application
            </Typography>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <form onSubmit={handleSubmit}>
                {getStepContent(activeStep)}
                <div>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </div>
            </form>
        </Container>
    );
};

export default ApplicationForm;
