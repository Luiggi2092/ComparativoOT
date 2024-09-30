import React, { useState,useRef } from 'react';
import './Login.css'; // Importamos el archivo de estilos
import {useNavigate} from "react-router-dom"
import {supabase} from '../../services/fetch'
import { Toast } from 'primereact/toast';
import { useUserStore } from '../../store/UserStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const {getUser} = useUserStore();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);

    const response = await supabase.from('Usuarios').select().match({Login: email,Password:password});

    console.log(response.data)




    if(response.data?.length === 1){
       
      getUser(response.data);


      if(response.data[0].Estado){

       getUser(response.data); 
        
      localStorage.setItem('User',JSON.stringify(response.data) );
         
        navigate('/pre');
       }else{
        
       toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Usuario Inactivo', life: 3000 }); 
      }
    }else{
       console.log('du')
      
       toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas', life: 3000 });
    }
    
    
  };

  return (
    <div className="login-container" >
      <Toast ref={toast} />   
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