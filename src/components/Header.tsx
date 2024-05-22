import Logo from '../assets/isograf.jpg'
import { Link } from 'react-router-dom';


const Header:React.FC = () => {

  return (
    <header style={{display:'flex',backgroundColor:'#007bff',justifyContent:'space-between',position:'relative',alignItems:'center'}}>
        <img src={Logo} alt='Isograf' style={{height:'50px'}}/>
        <nav style={{display:'inline-block',marginRight:'10px'}}>
            <ul style={{display:'flex',gap: '10px'}}>
                <li style={{listStyle:'none'}}>
                    <Link to="/" style={{color:'white'}}>Presupuestado</Link>
                    
                </li>
                <li style={{listStyle:'none'}}>
                    <Link to="/real" style={{color:'white'}}>Presupuestado vs Real</Link>
                </li>
            </ul>
        </nav>
    </header>
  )
 

}


export default Header;