import './App.css'
import Header from './components/Header';
import Real from './pages/real';
import Presupuestado from './pages/presupuestado';
import Login from './pages/Login/Login';
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
     </Routes>
    </div> 
  )
}

export default App;
