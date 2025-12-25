import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import LoanCalculator from './LoanCalculator';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <HeroSection />
        <LoanCalculator />
      </main>
    </div>
  );
};

export default LandingPage;
