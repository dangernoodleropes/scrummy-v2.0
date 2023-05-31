import { GoogleLogin, googleLogout } from "@react-oauth/google";
import React from "react";
import jwtDecode from "jwt-decode";

const Login = (props) => {
const {user, setUser} = props;

let anonNames = [
  'alligator',
  'anteater',
  'armadillo',
  'auroch',
  'axolotl',
  'badger',
  'bat',
  'bear',
  'beaver',
  'blobfish',
  'buffalo',
  'camel',
  'chameleon',
  'cheetah',
  'chipmunk',
  'chinchilla',
  'chupacabra',
  'cormorant',
  'coyote',
  'crow',
  'dingo',
  'dinosaur',
  'dog',
  'dolphin',
  'dragon',
  'duck',
  'octopus',
  'elephant',
  'ferret',
  'fox',
  'frog',
  'giraffe',
  'goose',
  'gopher',
  'grizzly',
  'hamster',
  'hedgehog',
  'hippo',
  'hyena',
  'jackal',
  'jackalope',
  'ibex',
  'ifrit',
  'iguana',
  'kangaroo',
  'kiwi',
  'koala',
  'kraken',
  'lemur',
  'leopard',
  'liger',
  'lion',
  'llama',
  'manatee',
  'mink',
  'monkey',
  'moose',
  'narwhal',
  'nyan cat',
  'orangutan',
  'otter',
  'panda',
  'penguin',
  'platypus',
  'python',
  'pumpkin',
  'quagga',
  'quokka',
  'rabbit',
  'raccoon',
  'rhino',
  'sheep',
  'shrew',
  'skunk',
  'squirrel',
  'tiger',
  'turtle',
  'unicorn',
  'walrus',
  'wolf',
  'wolverine',
  'wombat',
];

  const handleSuccess = (credentialRes) => {
    const userObj = jwtDecode(credentialRes.credential);
    console.log(userObj);
    setUser(userObj.name);
  }

    const handleLogout = () => {
    googleLogout();
    const rndNm = Math.round(Math.random() * anonNames.length)
    setUser(anonNames[rndNm]);
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

