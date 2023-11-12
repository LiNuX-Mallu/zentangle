import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/user/home/Home';
import App from './pages/user/app/App';

export default function AppRouter() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/app' element={<App />} />
      </Routes>
    </Router>
  )
}