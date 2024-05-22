import './App.css'
import Header from './components/Header';
import Real from './pages/real';
import Presupuestado from './pages/presupuestado';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';





const App: React.FC = () => {
  
  


  return (
    <Router>
     <div>
     <Header/>
     <Routes>
     <Route  path='/'  element={<Presupuestado/>}/>
     <Route path="/real" element={<Real/>} />
     </Routes>
    </div> 
    </Router>
  )
}

export default App;
