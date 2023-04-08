// source: https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d
// npm install @react-google-maps/api

import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import Home from './Pages/Home'
import {ParcelListProvider} from './ParcelListContext';

function App() {

  return (
  	<div className="App">
  		<ParcelListProvider>
		    <BrowserRouter>
		      <Routes>
		        <Route index element={<Home />} />
		      </Routes>
		    </BrowserRouter>
	    </ParcelListProvider>
    </div>
  );
}

export default App;



