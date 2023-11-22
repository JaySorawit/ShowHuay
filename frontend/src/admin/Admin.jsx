import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function Admin() {
  return (
      <div className="wrapper">
        <Header />
        <Sidebar />
        {/* <Content /> */}
      </div>
  );
}

export default Admin;