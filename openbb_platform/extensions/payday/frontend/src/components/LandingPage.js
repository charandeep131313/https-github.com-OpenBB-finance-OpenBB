import React from 'react';

const LandingPage = () => {
  return (
    <div>
      <header className="header">
        <div className="logo">Payday</div>
        <nav className="nav">
          <a href="#">Products</a>
          <a href="#">Why iCash</a>
          <a href="#">Resources</a>
          <a href="#">Help</a>
        </nav>
      </header>
      <main className="main-content">
        <section className="hero-section">
          <h1>Fastest & Fairest e-Transfer Online Payday Loans in Canada</h1>
          <p>Take care of whatever expenses life throws at you. Get approved instantly for up to $1,500, 24/7, from across Canada.</p>
          <a href="#" className="cta-button">24/7 service · Apply now</a>
        </section>
        <section className="loan-calculator">
          <h2>Customize your instant loan</h2>
          <form>
            <div className="form-group">
              <label htmlFor="loan-amount">Select the amount you wish to borrow</label>
              <input type="range" id="loan-amount" name="loan-amount" min="100" max="1500" defaultValue="750" />
            </div>
            <div className="form-group">
              <label htmlFor="province">Select province of residence</label>
              <input type="text" id="province" name="province" />
            </div>
            <div className="form-group">
              <label>Number of payments</label>
              <div>
                <button type="button">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
              </div>
            </div>
            <button type="submit" className="cta-button">Apply now</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
