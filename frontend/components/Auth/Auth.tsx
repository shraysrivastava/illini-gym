import React, {useState} from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';

export const Auth = () => {  

  const [hasAccount, setHasAccount] = useState(true);

  if (!hasAccount) {
    return (<SignUp setHasAccount={setHasAccount}/>);
  } else {
    return (<SignIn setHasAccount={setHasAccount}/>);
  }
};