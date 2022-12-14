import { createContext } from 'react';

 const AuthContext = createContext({
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export default AuthContext;