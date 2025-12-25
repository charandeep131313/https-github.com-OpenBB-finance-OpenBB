import React, { useState, useEffect } from 'react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(750);
  const [numPayments, setNumPayments] = useState(1);
  const [province, setProvince] = useState('ON');
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const INTEREST_RATES = {
    'AB': 0.15,
    'ON': 0.15,
    'BC': 0.15,
    'MB': 0.17,
    'NB': 0.15,
    'NL': 0.21,
    'NS': 0.19,
    'PE': 0.15,
    'SK': 0.17,
  };

  useEffect(() => {
    const calculateRepayment = () => {
      const interestRate = INTEREST_RATES[province];
      const interest = loanAmount * interestRate;
      const total = parseFloat(loanAmount) + interest;
      setTotalRepayment(total.toFixed(2));
      setPaymentAmount((total / numPayments).toFixed(2));
    };
    calculateRepayment();
  }, [loanAmount, province, numPayments]);

  return (
    <section className="loan-calculator">
      <h2>Customize your instant loan</h2>
      <form>
        <div className="form-group">
          <label htmlFor="loan-amount">Select the amount you wish to borrow: ${loanAmount}</label>
          <input
            type="range"
            id="loan-amount"
            name="loan-amount"
            min="100"
            max="1500"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="province">Select province of residence</label>
          <select id="province" name="province" value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="SK">Saskatchewan</option>
          </select>
        </div>
        <div className="form-group">
          <label>Number of payments: {numPayments}</label>
          <div>
            <button type="button" onClick={() => setNumPayments(1)}>1</button>
            <button type="button" onClick={() => setNumPayments(2)}>2</button>
            <button type="button" onClick={() => setNumPayments(3)}>3</button>
          </div>
        </div>
        <h3>{numPayments} payment(s) of ${paymentAmount}</h3>
        <h4>Total Repayment: ${totalRepayment}</h4>
        <button type="submit" className="cta-button">Apply now</button>
      </form>
    </section>
  );
};

export default LoanCalculator;
