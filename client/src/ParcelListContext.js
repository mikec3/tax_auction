import { createContext, useContext, useReducer, useState } from 'react';
import getParcelList from './GetParcelList'

const ListContext = createContext(null);
const ListDispatchContext = createContext(null);

export function ParcelListProvider({ children }) {
  const [list, dispatch] = useReducer(
    listReducer,
    initialList
  );

  return (
    <ListContext.Provider value={list}>
    	<ListDispatchContext.Provider value={dispatch}>
        	{children}
        </ListDispatchContext.Provider>
    </ListContext.Provider>
  );
};

function listReducer(list, action) {
  switch (action.type) {
    case 'added': {
      return [...list, {
	        county: action.county,
	        price: action.price,
	        parcel_number: action.parcel_number
      	}];
  		}
    case 'initialize': {
      console.log(action.payload);
      return action.payload
    }
  	case 'filter': {
  		return list.filter(t => t.county !== action.criteria);
  		}
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};

export function useList() {
  return useContext(ListContext);
};

export function useListDispatch() {
  return useContext(ListDispatchContext);
};

  const initialList = 'Loading...'
