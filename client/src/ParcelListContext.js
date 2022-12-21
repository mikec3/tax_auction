import { createContext, useContext, useReducer, useState } from 'react';
import getParcelList from './GetParcelList'

const ListContext = createContext(null);
const ListDispatchContext = createContext(null);

export function ParcelListProvider({ children }) {
  const [list, dispatch] = useReducer(
    listReducer
    , initialList
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
  //let initialList;
  switch (action.type) {
    case 'initialize': {
      // add the list to context, and add Client information
      // by default, all parcels are NOT the selected parcel (isSelectedParcel=false)
      // parcel markers will call a dispatch action to modify the isSelectedParcel to true, when selected
      let modifiedList = action.payload.map((item) => {
        // parse integer from taxable total and put back into item.
        // can delete tax integer parsing line once scraped values are only integers.
        if (typeof item.Tax.TAXABLE_TOTAL == 'string') {
          item.Tax.TAXABLE_TOTAL = parseInt(item.Tax.TAXABLE_TOTAL.replace(/[^0-9]/g, ""));
        }
        return {
          ...item,
          Client: {
            isSelectedParcel: false
          }
        }
      });
      initialList = modifiedList;
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
  	case 'filter_price': {
      // filtering on initialList so that filter settings don't drop all parcels after subsequent filtering
      // TODO make sure other filters don't get dropped, maybe need to set all filters at the same time.
      return initialList.filter(t => t.Tax.TAXABLE_TOTAL <= action.max && t.Tax.TAXABLE_TOTAL >= action.min);
    }
    case 'filter_acres': {
      return initialList.filter(t=> t.Land.Acres <= action.max && t.Land.Acres >= action.min);
    }
    case 'filter_apply_all': {
      // chain the filters together off the initial list. Starting with initialList so that filters are applied to full set.
      let priceFiltered = initialList.filter(t => t.Tax.TAXABLE_TOTAL <= action.price.max && t.Tax.TAXABLE_TOTAL >= action.price.min);
      let acreFiltered = priceFiltered.filter(t=> t.Land.Acres <= action.acre.max && t.Land.Acres >= action.acre.min);
      return acreFiltered;
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

// set the first initializer action to update this, allows for resetting back to first results
let initialList;
