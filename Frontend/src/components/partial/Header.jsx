import React from 'react';

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <button className="header-button">Time IN</button>
        <button className="header-button">Time Out</button>
        <a href="/application" className="header-link">Apply Leave Application</a>
        <a href="/" className="header-link">Logout</a>
      </div>
    </header>
  );
}

export default Header;
