import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import Rout from './Routes';
import { useEffect, useState } from 'react';
import Signin from './components/Auth/signin';
import Signup from './components/Auth/Signup';
import Footer from './components/footer';

import Lottie from 'react-lottie';
import * as animationData from './assets/lotties/loader.json'
import hideNavContext from './context/AllprojectsContext';
import AuthContext from './context/AuthCntx';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  const [isAuth, setAuth] = useState(false)

  const [isStopped, setStoped] = useState(true)
  const [hidenav, sethidenav] = useState(false)
  const nav = { hidenav, sethidenav }
  const Auth = { isAuth, setAuth }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const isTokenExpired = (token) => {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  setTimeout(() => {
    setStoped(false)
  }, 4000);

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token) {
      let expired = isTokenExpired(token)
      if (expired == false) {
        setAuth(true)
      } else {
        setAuth(false)
      }
    }
  }, [])

  console.log(isAuth);

  return (
    <div className="App">
      <AuthContext.Provider value={Auth}>
        <hideNavContext.Provider value={nav}>

          <Router className='relative'>
            {!isStopped ? null :
              <div className='fixed w-screen z-50 flex items-center bg-gray-300 opacity-80 h-screen'>
                <Lottie options={defaultOptions}
                  height={80}
                  width={80}
                  isStopped={isStopped}
                  isPaused={isStopped}
                  className='absolute top-2/4 transform -translate-x-2/4 mt-auto mb-auto z-50 '
                />
              </div>
            }
            {hidenav ? null : <Header />}
            <Rout />
            {hidenav ? null : <Footer />}
          </Router>
        </hideNavContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
