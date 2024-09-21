import React, { useState } from 'react';
import './Login.css'; // Importamos el archivo de estilos
import {useNavigate} from "react-router-dom"

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
    // Lógica de autenticación aquí
    if (email === "admin" && password === "1234"){
       navigate('/pre');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Bienvenidos</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Usuario</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>

          <p className="login-footer">
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;