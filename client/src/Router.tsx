import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/user/home/Home';
import App from './pages/user/app/App';
import AdminLogin from './pages/admin/login/AdminLogin';
import Panel from './pages/admin/panel/Panel';

export default function AppRouter() {
  return(
    <Router>
      <Routes>
        {/* User routes */}
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/app' element={<App defaultSpace={null} />} />
        <Route path='/app/view-profile/:username' element={<App defaultSpace='view-profile' />} />
        <Route path='/app/view-blocked-profile/:username' element={<App defaultSpace='view-blocked-profile' />} />
        <Route path='/app/account' element={<App defaultSpace='account' /> } />
        <Route path='/app/explore' element={<App defaultSpace='explore' /> } />
        <Route path='/app/messages' element={<App defaultSpace='messages' /> } />
        <Route path='/app/matches' element={<App defaultSpace='matches' /> } />
        <Route path='/app/account/edit-profile' element={<App defaultSpace='edit-profile' /> } />
        <Route path='/app/account/settings' element={<App defaultSpace='settings' /> } />
        <Route path='/app/chat/:username' element={<App defaultSpace={'chat'} defaultMessage={true} />} />

        {/* Admin routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/panel' element={<Panel />} />

        {/* 404 */}
        <Route path='*' element={
          <div style={{height: '100vh'}} className='d-flex flex-column text-white bg-black justify-content-center align-items-center'>
            <h1><i className="fa-solid fa-cat fa-beat text-white"> 404</i></h1>
            <h3>Page not found!</h3>
          </div>
        }/>
      </Routes>
    </Router>
  )
}