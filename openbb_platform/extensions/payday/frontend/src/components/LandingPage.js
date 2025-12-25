import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import LoanCalculator from './LoanCalculator';
import WhyChooseUs from './WhyChooseUs';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <HeroSection />
        <LoanCalculator />
        <WhyChooseUs />
      </main>
    </div>
  );
};

export default LandingPage;
