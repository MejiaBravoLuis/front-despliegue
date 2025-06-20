import { useRef } from "react";
import { useEffect } from "react";
import { Login } from "../../components/Login";
import { Register } from "../../components/Register";
import SilkBackground from "../../components/animations/Background";
import "./styleAuth.css";
import logo from "../../assets/img/penguin-logo.png";

import iconSwitch from "../../assets/icons/1.png";

export const Auth = () => {
  const containerRef = useRef(null);

  const handleSignInClick = () => {
    containerRef.current?.classList.remove("toggle");
  };

  const handleSignUpClick = () => {
    console.log("Registrarse clickeado");
    containerRef.current?.classList.add("toggle");
  };

  useEffect(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.lineicons.com/4.0/lineicons.css";
  document.head.appendChild(link);

  return () => {
    document.head.removeChild(link);
  };
}, []);

  return (
    <>
      <SilkBackground
        speed={6}
        scale={1}
        noiseIntensity={0}
        rotation={0}
        color={"#e87d7d"}
      />

      <div className="app">
        <div className="container" ref={containerRef}>
          <div className="container-form sign-in-container">
            <Login switchAuthHandler={handleSignUpClick} />
          </div>

          <div className="container-form sign-up-container">
            <Register switchAuthHandler={handleSignInClick} />
          </div>

          <div className="container-welcome">
            <div className="welcome welcome-sign-up">
              <h3>¡Bienvenido!</h3>
              <p>Ingrese sus datos</p>
              <button className="button" onClick={handleSignUpClick}>
                <img
                  src={iconSwitch}
                  alt="icono password"
                  className="input-icon"
                />
                Registrarse <i className="lni lni-arrow-left login"></i>
              </button>
            </div>
            <div className="welcome welcome-sign-in">
              <h3>¡Hola!</h3>
              <p>Registre sus datos</p>

              <button className="button" onClick={handleSignInClick}>
                <img
                  src={iconSwitch}
                  alt="icono password"
                  className="input-icon"
                />
                Iniciar Sesión <i className="lni lni-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
