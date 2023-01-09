import React, {useState, useEffect} from 'react'

const PictureCard = (props) => {

	// default is picture text will show 0/0 unless parcel has pictures.
	const [pictureIndex, setPictureIndex] = useState(0);
	const [pictureTotal, setPictureTotal] = useState(0);

	// default is buttons that work (not disabled).
	const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

	// default picture url is missing icon
	const [pictureURL, setPictureURL] = useState('./missing_icon.png');

	// this will be called whenever the selected parcel changes. Reset values.
	useEffect(()=>{
		if(props.selectedParcel.Pictures) {
			setPictureURL(props.selectedParcel.Pictures[0]);
			setPictureIndex(0);
			setPictureTotal(props.selectedParcel.Pictures.length);
			setButtonIsDisabled(false);
		} else {
			setPictureURL('./missing_icon.png');
			// setting index as -1 because text in render will add a 1.
			setPictureIndex(-1);
			setPictureTotal(0);
			setButtonIsDisabled(true);
		}
	}, [props.selectedParcel]);

	const incrementPictureURL = () => {
		// check if we can safely increment, otherwise overflow to 0
		if (pictureIndex < pictureTotal-1) {
			setPictureURL(props.selectedParcel.Pictures[pictureIndex+1]);
			setPictureIndex(pictureIndex+1);
		} else {
			// if we're already at the top of the array, loop back to 0
			setPictureURL(props.selectedParcel.Pictures[0]);
			setPictureIndex(0);
		}
	}

	const decrementPictureURL = () => {
		// check if we can safely roll back a picture otherwise overflow to max array position
		if (pictureIndex > 0) {
			setPictureURL(props.selectedParcel.Pictures[pictureIndex-1]);
			setPictureIndex(pictureIndex-1);
		} else {
			// if we're already at 0, loop back to top of array
			setPictureURL(props.selectedParcel.Pictures[pictureTotal-1]);
			setPictureIndex(pictureTotal-1);
		}
	}

	
	return (
		<div className={"PictureCard"}>
			<button onClick={decrementPictureURL} disabled={buttonIsDisabled}> {'<'} </button>
				<img className={'parcelImage'} src={pictureURL}/>
				<p> {pictureIndex+1} / {pictureTotal} </p>
			<button onClick={incrementPictureURL} disabled={buttonIsDisabled}> {'>'} </button>
		</div>
		)
	
}

export default PictureCard;