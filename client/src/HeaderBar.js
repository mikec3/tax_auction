import LoginCard from './LoginCard'

const HeaderBar = () => {
	


return (
	<div className='HeaderBar'>
		<a style={{ textDecoration: 'none' , color: 'black'}} href='https://www.countyauctionproperties.com'>
			<h4> Washington State County Tax Foreclosure Properties </h4>
			</a>
		<LoginCard/>
	</div>
)

}

export default HeaderBar;