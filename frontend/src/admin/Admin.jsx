import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function Admin() {
  return (
    <div>
        <Header />
        <Sidebar />
        <Content />
    </div>
  );
}

export default Admin;