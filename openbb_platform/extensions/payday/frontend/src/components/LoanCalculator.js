import React, { useState, useEffect } from 'react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(750);
  const [numPayments, setNumPayments] = useState(1);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const INTEREST_RATE = 0.15; // 15% interest rate for Ontario

  useEffect(() => {
    const calculateRepayment = () => {
      const interest = loanAmount * INTEREST_RATE;
      const total = parseFloat(loanAmount) + interest;
      setTotalRepayment(total.toFixed(2));
    };
    calculateRepayment();
  }, [loanAmount]);

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
          <input type="text" id="province" name="province" />
        </div>
        <div className="form-group">
          <label>Number of payments: {numPayments}</label>
          <div>
            <button type="button" onClick={() => setNumPayments(1)}>1</button>
            <button type="button" onClick={() => setNumPayments(2)}>2</button>
            <button type="button" onClick={() => setNumPayments(3)}>3</button>
          </div>
        </div>
        <h3>Total Repayment: ${totalRepayment}</h3>
        <button type="submit" className="cta-button">Apply now</button>
      </form>
    </section>
  );
};

export default LoanCalculator;
