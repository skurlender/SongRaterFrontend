import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom"
import Register from './components/Register/Register'
import Login from "./components/Login/Login"
import Music from "./components/Music/Music"

function App() {

  return (
    <main className="App">
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="register" element={ <Register/> } />
        <Route path="music" element={ <Music/> } />

      </Routes>
    </main>
  );
}


export default App;