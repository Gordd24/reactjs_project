import React from 'react';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Level from './pages/Level';
import Phase from './pages/Phase';
import Area from './pages/Area';
import Parameter from './pages/Parameter';
import Registration from './pages/Registration';
import UpdateProfile from './pages/UpdateProfile';
import Profile from './pages/Profile';
import Logs from './pages/Logs';
import Archives from './pages/Archives';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { RedirectHome,RequireAuth,AdminCheck} from './pages/RequireAuth'

function App() {
  
  return (
    <div className="h-100">
        <BrowserRouter>
          <Routes>
            <Route path="/" element ={<RedirectHome><SignIn /></RedirectHome>}/>
            <Route path='/home' element={<RequireAuth><Home/></RequireAuth>}></Route>
            <Route path='/home/level/:id' element={<RequireAuth><Level/></RequireAuth>}></Route>
            <Route path='/home/level/:id/:phaseId' element={<RequireAuth><Phase/></RequireAuth>}></Route>
            <Route path='/home/level/:id/:phaseId/:areaId' element={<RequireAuth><Area/></RequireAuth>}></Route>
            <Route path='/home/level/:id/:phaseId/:areaId/:paramId' element={<RequireAuth><Parameter/></RequireAuth>}></Route>
            <Route path='/registration' element={<RequireAuth><AdminCheck><Registration/></AdminCheck></RequireAuth>}></Route>
            <Route path='/update-profile' element={<RequireAuth><UpdateProfile/></RequireAuth>}></Route>
            <Route path='/logs' element={<RequireAuth><AdminCheck><Logs/></AdminCheck></RequireAuth>}></Route>
            <Route path='/profile' element={<RequireAuth><Profile/></RequireAuth>}></Route>
            <Route path='/Archives' element={<RequireAuth><Archives/></RequireAuth>}></Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
