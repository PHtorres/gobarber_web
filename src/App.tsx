import React from 'react';
import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';

import AppProvider from './hooks';

function App() {
  return (
    <>
      <AppProvider>
        <SignIn />
      </AppProvider>
      <GlobalStyle />
    </>
  );
}

export default App;
