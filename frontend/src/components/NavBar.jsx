import React, { useState } from 'react';
import MetaMaskConnector from './MetaMaskConnector';

const Navbar = () => {

  return (
    <nav className=" text-white flex justify-end p-3">

    
              <MetaMaskConnector/>
  

    </nav>
  );
};

export default Navbar;
