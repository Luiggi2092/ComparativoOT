import './App.css'
import Header from './components/Header';
import Real from './pages/real';
import Presupuestado from './pages/presupuestado';
import Login from './pages/Login/Login';
import  Usuarios  from './pages/Usuarios/Usuarios';
import Vendedores from './pages/Vendedores/Vendedores';
import DashboardWithChart from './pages/Dashboard/Dashboard';
import { Routes, Route,useLocation} from 'react-router-dom';





const App: React.FC = () => {
  
  const location = useLocation();


  return (
     <div>
      {location.pathname !== "/" && <Header/>}
     <Routes>
     <Route path='/' element={<Login/>}/>
     <Route path='/pre'  element={<Presupuestado/>}/>
     <Route path="/real" element={<Real/>} />
     <Route path='/usuarios' element={<Usuarios/>}/>
     <Route path='/ven' element={<Vendedores/>}/>
     <Route path='/dash' element={<DashboardWithChart/>} />
     </Routes>
    </div> 
  )
}

export default App;
