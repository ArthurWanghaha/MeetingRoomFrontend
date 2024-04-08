// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Notifications from './Pages/Notifications'; 
import Login from './Pages/login/Login';
import MeetingSchedule from './Pages/MeetingSchedule';
import Signup from './Pages/signup/Signup';
import './App.css';
import PersonalSettings from './Pages/PersonalSettings';
import Reserve from './Pages/Reserve';
import FilesArchive from './Pages/FilesArchive';
import Teams from './Pages/Team';
import Invitations from './Pages/Invitation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login className="page" />} />
        <Route exact path="/signup" element={<Signup className="page" />} />
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/schedule" element={<MeetingSchedule />} />
        <Route exact path="/settings" element={<PersonalSettings />} />
        <Route exact path="/reserve" element={<Reserve />} />
        <Route exact path="/files" element={<FilesArchive />} />
        <Route exact path="/teams" element={<Teams />} />
        <Route exact path="/invitations" element={<Invitations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
