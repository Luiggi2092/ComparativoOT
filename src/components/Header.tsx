import Logo from '../assets/isograf.jpg'
import { Link,Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import image from '../assets/photo.png'

const Header:React.FC = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };

  return (
    <header style={{display:'flex',backgroundColor:'#007bff',justifyContent:'space-between',position:'relative',alignItems:'center'}}>
        <img src={Logo} alt='Isograf' style={{height:'55px'}}/>
        <nav style={{display:'flex',justifyContent:'space-between',alignContent:'center',padding: '8px 20px'}}>
            <ul style={{display:'flex',listStyle:'none',margin:0,padding:0,gap:'15px'}}>
                <li style={{listStyle:'none'}}>
                    <Link to="/pre" style={{color:'white'}}>Presupuestado</Link>
                    
                </li>
                <li style={{listStyle:'none',position:'relative'}}>
                    <Link to="/real" style={{color:'white'}}>Presupuestado vs Real</Link>
                </li>
                <li style={{listStyle:'none',position:'relative'}}>
                <Link to={'#'} style={{color:'white',background:'none',border:'none',fontSize:16,cursor:'pointer',position:'relative'}} onClick={toggleDropdown}>
                <img src={image} style={{borderRadius:50,height:30,width:30}} />
                </Link>
                </li>
                {isDropdownOpen && (
            <ul style={{position:'absolute',top:'100%',right:0,backgroundColor:'white',color:'black',borderRadius:'5px',padding:'10px',boxShadow:'0 8px 16px rgba(0, 0, 0, 0.2)',listStyle:'none',margin:0,minWidth:150,zIndex:1}}>
              <li style={{margin:0}}>
                <Link to="/">Vendedores</Link>
              </li>
              <li>
              <Link to="/usuarios">Usuarios</Link>
              </li>
              <li>
              <Link to="/">Salir</Link>
              </li>
                
            </ul>
        

          )}
          
          <Outlet/>
            </ul>
            <Outlet/>
        </nav>
    </header>
  )
 

}


export default Header;