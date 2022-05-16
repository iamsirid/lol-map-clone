import { useState, useEffect } from 'react';

import Map from './components/Map';
import Login from './components/Login';

function App() {
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    (async () => {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        }
      }
    })();
  }, []);

  return userAddress ? (
    <Map />
  ) : (
    <Login
      login={async () => {
        if (!(window as any).ethereum) {
          alert('Get MetaMask!');
          return;
        }

        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });

        setUserAddress(accounts[0]);
      }}
    />
  );
}

export default App;
