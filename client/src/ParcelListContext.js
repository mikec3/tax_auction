import { createContext, useContext, useReducer, useState } from 'react';
import getParcelList from './GetParcelList'

const ListContext = createContext(null);
const ListDispatchContext = createContext(null);

export function ParcelListProvider({ children }) {
  const [list, dispatch] = useReducer(
    listReducer
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
    case 'initialize': {
      // add the list to context, and add Client information
      // by default, all parcels are NOT the selected parcel (isSelectedParcel=false)
      // parcel markers will call a dispatch action to modify the isSelectedParcel to true, when selected
      let modifiedList = action.payload.map((item) => {
        return {
          ...item,
          Client: {
            isSelectedParcel: false
          }
        }
      });
      return modifiedList
    }
    case 'setSelected': {
      // wipe all isSelectedParcel back to false before selecting single parcel
      list.map((item)=> {
        item.Client.isSelectedParcel = false;
        return item;
      })
      // modify the list so that the selected parcel's Client.isSelectedParcel = true.
      let listWithSelected = list.map((item) => {
        if (item.Basic.PARCEL_NUM == action.parcelNum) {
          item.Client.isSelectedParcel = true;
        }
        return item;
      });
      return listWithSelected;
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
