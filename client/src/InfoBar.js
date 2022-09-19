import React, {useState, useEffect} from 'react'

const InfoBar = (props) => {

	const [mouseIn, setMouseIn] = useState(false);

	// loop through entries
	const entries = [];

	for (const [key, value] of Object.entries(props.entries)) {
		entries.push(<li className={mouseIn ? "InfoShow" : "InfoHide"}>{key}: {value}</li>);
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
		<div
		onMouseEnter = {handleMouseEnter}
		onMouseLeave = {handleMouseLeave}>
			<h3> {props.header} </h3>
			<ul className='InfoBarList'>
				{entries}
			</ul>
		</div>
	)
}

export default InfoBar;