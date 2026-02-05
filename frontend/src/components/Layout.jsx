import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="layout">
        {children}
      </main>
    </>
  );
};

export default Layout;
