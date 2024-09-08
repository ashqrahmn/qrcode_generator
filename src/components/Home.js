// components/Home.js
import React from 'react';
import InputForm from './InputForm';
import QrCode from './QrCode';

const Home = () => {
  return (
    <div className="md:grid md:grid-cols-3">
      <InputForm />
      <QrCode />
    </div>
  );
};

export default Home;
