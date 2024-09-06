import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MetaMaskProvider } from '@metamask/sdk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: 'FE',
          url: window.location.href,
        },
        infuraAPIKey: "0d6c21ae0b2645989f6fdcd5fb225e1c",
      }}
    >
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);