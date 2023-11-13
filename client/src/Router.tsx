import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/user/home/Home';
import App from './pages/user/app/App';
import AdminLogin from './pages/admin/login/AdminLogin';
import Panel from './pages/admin/panel/Panel';

export default function AppRouter() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/app' element={<App />} />

        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/panel' element={<Panel />} />
      </Routes>
    </Router>
  )
}