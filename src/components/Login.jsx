import { GoogleLogin, googleLogout } from "@react-oauth/google";
import React from "react";
import jwtDecode from "jwt-decode";
import {socket} from "../socket";
import anonNames from "../../server/anonNames";

const Login = (props) => {
const {user, setUser} = props;

  const handleSuccess = (credentialRes) => {
    const googleUser = jwtDecode(credentialRes.credential);
    console.log(googleUser);
    setUser(googleUser.name);
    socket.emit('logged-in', googleUser.name);
    const username = googleUser.name;
    fetch('/users', {
      method: 'POST',
      headers:  {'Content-Type': 'application/json'},
      body: JSON.stringify({username})
    }).then(() => console.log('sent'));
  }

    const handleLogout = () => {
    googleLogout();
    const rndNm = Math.round(Math.random() * anonNames.length)
    const newName = anonNames[rndNm]
    setUser(newName);
    socket.emit('logged-out', newName)
  };

  return (
    <div>
      {user && !anonNames.includes(user) ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log('Login failed');
      }}
      scope={["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]}
    />
      )}
    </div>
  );
};

export default Login;

