import Logo from '../assets/isograf.jpg'
import { Link,Outlet } from 'react-router-dom';
import React, { useState } from 'react';
//import image from '../assets/photo.png'
import {useUserStore} from '../store/UserStore'
import 'primeicons/primeicons.css';
        

const Header:React.FC = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const UserLocal = JSON.parse(localStorage.getItem('User') || '[]');
    const {User}= useUserStore();

    console.log(UserLocal[0].image);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };

  return (
    <header style={{display:'flex',backgroundColor:'#007bff',justifyContent:'space-between',position:'relative',alignItems:'center'}}>
        <img src={Logo} alt='Isograf' style={{height:'55px'}}/>
        <nav style={{display:'flex',justifyContent:'space-between',alignContent:'center',padding: '8px 20px'}}>
            <ul style={{display:'flex',listStyle:'none',margin:0,padding:0,gap:'15px'}}>
                <li style={{listStyle:'none'}}  >
                    <Link to="/pre"  style={{color:'white'}}><i className="pi pi-receipt" style={{ color: 'white',margin:'0 0.5em' }}></i>Presupuestado</Link>
                    
                </li>
                <li style={{listStyle:'none',position:'relative'}}>
                    <Link to="/real"  style={{color:'white'}}><i className="pi pi-money-bill" style={{ color: 'green',margin:'0 0.5em' }}></i>Presupuestado vs Real</Link>
                </li>
                <li style={{listStyle:'none',position:'relative'}}>
                <Link to={'#'} style={{color:'white',background:'none',border:'none',fontSize:16,cursor:'pointer',position:'relative'}} onClick={toggleDropdown}>
                {<img src={User[0].image ?? undefined  } style={{borderRadius:50,height:30,width:30}} />}
                </Link>
                </li>
                {isDropdownOpen && (
            <ul style={{position:'absolute',top:'100%',right:0,backgroundColor:'white',color:'black',borderRadius:'5px',padding:'10px',boxShadow:'0 8px 16px rgba(0, 0, 0, 0.2)',listStyle:'none',margin:0,minWidth:150,zIndex:1}}>
             {User[0].VVendedores && <li style={{margin:'5px 2px'}}>
                <Link to="/ven" onClick={toggleDropdown}><i className="pi pi-bullseye" style={{ color: 'slateblue',margin:'0 0.5em' }}></i>Vendedores</Link>
              </li>}
             { User[0].VUsers && <li  style={{margin:'5px 2px'}}>
              <Link to="/usuarios" onClick={toggleDropdown}><i className="pi pi-user" style={{ color: 'slateblue',margin:'0 0.5em' }}></i>Usuarios</Link>
              </li>}
              <li>
              <Link to="/dash" onClick={toggleDropdown}><i className="pi pi-bullseye" style={{ color: 'slateblue',margin:'0 0.5em' }}></i>Dashboard</Link>
              </li>
              <li>
              <Link to="/"><i className="pi pi-sign-in" style={{ color: 'slateblue',margin:'0 0.5em' }}></i>Salir</Link>
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