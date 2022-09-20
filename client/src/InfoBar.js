import React, {useState, useEffect} from 'react'

const InfoBar = (props) => {

	const [mouseIn, setMouseIn] = useState(false);

	// delcare a flexOrder variable, set by the props.header passed in. This will determine the order of the infoBar's in the infoCard
	let flexOrder;

	switch (props.header){
		case "Basic":
			flexOrder = 1;
			break;
		case "Building":
			flexOrder = 2;
			break;
		case "Land":
			flexOrder = 3;
			break;
		case "Tax":
			flexOrder = 4;
			break;
		default:
			flexOrder = 5;
			break;
	}

	// loop through entries
	const entries = [];

	for (const [key, value] of Object.entries(props.entries)) {
		entries.push(<li>{key}: {value}</li>);
	}

	const handleMouseEnter = (e) => {
		e.preventDefault();
		console.log('mouse entered!');
		setMouseIn(true);
	}

	const handleMouseLeave = (e) => {
		e.preventDefault();
		console.log('mouse left!');
		setMouseIn(false);
	}
	
	return (
		<div className='InfoBar'
		style={{order:flexOrder}}
		onMouseEnter = {handleMouseEnter}
		onMouseLeave = {handleMouseLeave}>
			<h3> {props.header} </h3>
			<ul className={mouseIn ? "InfoShow" : "InfoHide"}>
				{entries}
			</ul>
		</div>
	)
}

export default InfoBar;