import React from 'react';
import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
      <GlobalStyle />
    </>

  );
}

export default App;
