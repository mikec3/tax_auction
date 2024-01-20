import LoginCard from './LoginCard'

const HeaderBar = () => {
	//console.log('headerbar.js');


return (
	<div className='HeaderBar'>
		<a href='https://www.treasurelots.com'>
			<img src="/treasurelotslogo1.png" />
			</a>
		<h2> County Tax Auctions</h2>
		<LoginCard/>
	</div>
)

}

export default HeaderBar;