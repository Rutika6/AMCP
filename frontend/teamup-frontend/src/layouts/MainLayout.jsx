import React from 'react';
import Navbar from '../components/common/Navbar';

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
}
