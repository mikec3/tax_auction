// source: https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d
// npm install @react-google-maps/api

import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import Home from './Pages/Home'
import ParcelPage from './Pages/ParcelPage'
import {ParcelListProvider} from './ParcelListContext';

function App() {

  return (
  	<div className="App">
  		<ParcelListProvider>
		    <BrowserRouter>
		      <Routes>
		        <Route index element={<Home />} />
		        <Route path='ParcelPage' element={<ParcelPage/>}/>
		      </Routes>
		    </BrowserRouter>
	    </ParcelListProvider>
    </div>
  );
}

export default App;



