import React from 'react';

import SignIn from './pages/SignIn';
// import Signup from './pages/Signup';
import GlobalStyle from './styles/global';
import { AuthProvider } from './hooks/AuthContext';

const App = () => (
  <>
    <GlobalStyle />
    <AuthProvider>
      <SignIn />
    </AuthProvider>
    {/* <Signup /> */}
  </>
);

export default App;
