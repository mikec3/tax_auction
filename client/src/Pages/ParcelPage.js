import React, {useState, useEffect} from 'react'
import MyMap from '../MyMap.js'
import HeaderBar from '../HeaderBar.js'
import InfoCard from '../InfoCard.js'
import Filters from '../Filters.js'
import io from 'socket.io-client';
import GetData from '../GetData'

function ParcelPage() {


  return (
    	<React.Fragment>
	    	<GetData/>
			    <HeaderBar/>
			    <p> hellooo!! </p>
	    </React.Fragment>
  )
}

export default ParcelPage;