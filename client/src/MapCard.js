
const MapCard = props => {

	const cardStyle = {
		border: '1px solid black',
		display: 'flex'
	}
	
	return (
		<div style={cardStyle}>
			{props.children}
		</div>
		)
}

export default MapCard;