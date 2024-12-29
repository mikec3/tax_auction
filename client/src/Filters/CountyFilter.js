import React, {useEffect, useState} from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import { Menu } from '@mui/material';
import { ParcelListProvider } from '../ParcelListContext';


// https://mui.com/material-ui/react-select/ -- Multiple Select - Checkboxes
//https://codesandbox.io/p/sandbox/material-ui-multiple-select-with-select-all-option-givp5?file=%2Fsrc%2FApp.js

const CountyFilter = (props) => {

      // Available filter solutions
      var names = [
    ]

    //store the initial names for the drop down display
    const [initialNames, setInitialNames] = useState([]);


    // store the current filter seleections - start off with everything selected
    const [filterItemName, setFilterItemName] = useState(names);
    // store boolean if the 'Select All' button - start off with all selected
    const [isAllSelected, setIsAllSelected] = useState(true);

    useEffect(()=> {
        console.log('County Filter useEffect is firing')
    // get all the unique county names from the props.parcelList
    // loop through every parcel and add unique names to the name list
    props.parcelList.forEach((parcel)=> {
        //console.log(parcel.Meta.COUNTY);
        // if the names list DOES NOT incude the current county, then add it to the names list
        if (!names.includes(parcel.Meta.COUNTY)) {
            names.push(parcel.Meta.COUNTY);
        }
    })
    if(initialNames.length ==0) {
        setInitialNames(names);
        		
        // pass up filter settings on initial load so that filter component has them
		props.passUpFilterSettings({
			filter: 'county',
			value: names
		});

		// pass up filter settings to be saved in filter component as the default (reset) settings
		props.setInitialFilterSettings({
			filter: 'county',
			value: names
		});
    } else {
        setIsAllSelected(true);
        setFilterItemName(initialNames);
    }
    }, [props.triggerReset])

    // handle when filter dropdown selection is changed
    const handleChange = (event) => {
        // log all selected values
        console.log(event.target.value);
        // extract the selection array into variable 'value'
        const {
            target: { value },
            } = event;

        // On autofill we get a stringified value.
        var processedValue = value;
        if (typeof value === 'string'){
            processedValue = value.split(',');
        }

        // this will get sent up to the parent filter component after the logic if/else train.
        var valueToSendToFilterComponent;
        // check for All Selected
        if (processedValue.includes('Select All')){
            if(isAllSelected){  // if all selected is already true, then make everything empty
                setIsAllSelected(false);
                setFilterItemName([]);
                valueToSendToFilterComponent = [];
            }else {             // all has been selected, make the filter selection all possible values
                console.log('All counties selected');
                console.log(names);
                console.log(initialNames);
                setIsAllSelected(true);
                setFilterItemName(initialNames);
                valueToSendToFilterComponent = initialNames;
            }
        } else if (isAllSelected) { // all selected WAS true, but now an item has been removed
            setIsAllSelected(false);
            setFilterItemName(processedValue);
            valueToSendToFilterComponent = processedValue;
        } else {                    // all selected isn't involved, just fill the selected value into the filters
            setFilterItemName(processedValue); 
            valueToSendToFilterComponent = processedValue;
        }
        // pass up filter settings to the filter component
    	props.passUpFilterSettings({
            filter: 'county',
            value: valueToSendToFilterComponent
        });
        console.log(isAllSelected);
        console.log(filterItemName);
    };

    const doRender= (selected) => {
        if (isAllSelected) {
            return "";
        } else {
            return selected.join(', ');
        }
    }

    return (
        <div className='FilterItem'>
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">County</InputLabel>
            <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={filterItemName}
            onChange={handleChange}
            input={<OutlinedInput label="County" />}
            renderValue={(selected) => doRender(selected)}
            >
                <MenuItem value={"Select All"}>
                    <Checkbox checked={isAllSelected}/>
                    <ListItemText primary={"Select All"}/>
                </MenuItem>
            {initialNames.map((name) => (
                <MenuItem key={name} value={name}>
                <Checkbox checked={filterItemName.includes(name)} />
                <ListItemText primary={name} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        </div>
    )
}

export default CountyFilter;