import React from 'react';

import AppProvider from './hooks';
import SignIn from './pages/SignIn';
// import Signup from './pages/Signup';
import GlobalStyle from './styles/global';

const App = () => (
  <>
    <GlobalStyle />
    <AppProvider>
      <SignIn />
    </AppProvider>
    {/* <Signup /> */}
  </>
);

export default App;
