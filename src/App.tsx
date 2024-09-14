import './App.css'
import Header from './components/Header';
import Real from './pages/real';
import Presupuestado from './pages/presupuestado';
import { Routes, Route } from 'react-router-dom';





const App: React.FC = () => {
  
  


  return (
     <div>
     <Header/>
     <Routes>
     <Route  path='/'  element={<Presupuestado/>}/>
     <Route path="/real" element={<Real/>} />
     </Routes>
    </div> 
  )
}

export default App;
