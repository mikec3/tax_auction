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
            isSelectedParcel: false,
            inMapViewBounds: false
          }
        }
      });

      // Only render parcels with a Meta property
      modifiedList = modifiedList.filter(t=> typeof t.Meta != 'undefined');

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
    case 'filter_apply_all': {
      console.log('applying all filters');
      console.log('price max: ' + action.price.max);
      console.log('price min: ' + action.price.min);
      console.log('acres max: ' + action.acre.max);
      console.log('acres min: ' + action.acre.min);
      console.log('todays date: ' + new Date());
      console.log('pictures value: ' + action.picture.value);
      console.log('online value: ' + action.online.value);
      // chain the filters together off the initial list. Starting with initialList so that filters are applied to full set.
      // filter by min-max of price passed in
      let filtersApplied = initialList.filter(t => t.Tax.TAXABLE_TOTAL <= action.price.max && t.Tax.TAXABLE_TOTAL >= action.price.min);

      // filter on min-max acres passed in
      filtersApplied = filtersApplied.filter(t=> t.Land.Acres <= action.acre.max && t.Land.Acres >= action.acre.min);

      // filter everything with an auction date in the past IF avail.value is true
      if (action.avail.value) {
        console.log('applying date filter');
        filtersApplied = filtersApplied.filter(t=> new Date(t.Meta.AUCTION_DATE) >= new Date());
        }

      // filter for only online auctions IF online.value is true
      if (action.online.value) {
        filtersApplied = filtersApplied.filter(t=> t.Meta.AUCTION_SITE_FLAG == 'Online');
      }

      // filter for parcels that have a picture URL IF Pictures property is present
      if (action.picture.value) {
        filtersApplied = filtersApplied.filter(t=> t.Pictures);
      }
      return filtersApplied;
    }
    case 'filter_reset': {
      // return the original list, effectively erasing all previously applied filters
      return initialList;
    }
    case 'setParcelsInMapViewBounds' : {
      console.log('setting which parcels are in view on map idle')
      console.log(action.N)

      // set Client.inMapViewBounds to T or F based on coordinate values of viewport
      const alteredList = list.map((t)=> {
        const parcelLat = parseFloat(t.Location.LAT);
        const parcelLon = parseFloat(t.Location.LON);
        let inMapView = false;
            if (parcelLat >= action.S && parcelLat <= action.N && parcelLon <= action.E && parcelLon >= action.W) {
              inMapView = true;
            }

          return {
            ...t,
            Client: {
              inMapViewBounds: inMapView,
              isSelectedParcel: t.Client.isSelectedParcel
            }
          }
        })
      return alteredList;
    }
    case 'resetSelectedParcel' : {
      const listSelectedReset = list.map((t)=> {
        return {
          ...t,
          Client: {
            inMapViewBounds: t.Client.inMapViewBounds,
            isSelectedParcel: false
          }
        }
      })

      return listSelectedReset;
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
