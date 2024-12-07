# Tax Auctions

https://tax-auction.herokuapp.com/

This app is the only source of multiple county tax foreclosure auction parcel information for Washington State counties. Web scraping is done to obtain parcel information for all parcels subject to auction, react-app front end displays parcel info. Currenty backend is a mix of python and node, with firebase as the database.


# User Experience


# Dev

## Run
```
npm run build && npm start
```

## Roadmap
* Re-scrape so that tax values are integers
* parcel filtering
* format info card
* analytics on info card before selecting a parcel
* scrape King County
* scrape other counties
* subscription login
* market feedback
* marketing!!!



## Keeps API keys secret

#### Combines these tutorials:

##### websockets - not using ngrok currently for this app (no webhooks being used)
* https://socket.io/get-started/chat
* https://www.youtube.com/watch?v=9HFwJ9hrmls

1. Install ngrok
`brew install ngrok/ngrok/ngrok`
2. Add auth-token
`ngrok config add-authtoken TOKEN`
3. Expose localport to ngrok tunnel
`ngrok http 3001`

##### deployment and api secrets
* https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
* https://www.youtube.com/watch?v=FcwfjMebjTU
* https://github.com/kubowania/crypto-dashboard-react/blob/main/index.js


## Overview to deploy React/Node app to Heroku

1. create a new project folder
2. `npm init -y`
3. alter the package.json file
```
"scripts": {
	"start" : "node server/index.js",
	"build" : "cd client && npm install && npm run build"
},
"engines": {
	"node" : "16.3.0" // REPLACE_WITH_YOUR_VERSION
}
```
4. Create a front end & remove the default git repo (we're using git at the root folder of this project)
```
  npx create-react-app client
  cd client
  rm -rf .git
```
5. Create an account on Heroku.com and create a new app
6. Install heroku command line tool
```
sudo npm i -g heroku `
heroku login `
git init
heroku git:remote -a insert-your-app-name-here
git add .
git commit -m "Deploy app to Heroku"
git push heroku master
```
7. Create a github repo as well and copy the URL. You can check which remotes to send repo to by using `git remote -v `
```
git remote add <custom_name_for_this_remote> <github-url>
git push <custom_name_for_this_remote> master 
```

## Git Branching
```
git checkout new_feature

...do stuff...


git add .
git commit -m 'added features'
git push github new_feature

git checkout master
git merge new_feature
...commit master...

git push github --delete new_feature
```
## Hide API Keys
1. Create a .env file and populate with API keys like so:
```
MY_SECRET_FAKE_API_KEY=secret_fake_api_key_1234
```
2. Create a .gitignore file and populate with:
```
.env
```
3. Add require dotenv to node scripts
```
require('dotenv').config()
```
4. Reference env variable in node scripts as:
```
process.env.MY_SECRET_FAKE_API_KEY
```
5. Update Heroku console with environment variable in -> Settings -> Config Vars
6. Now you can redeploy to heroku and your environment variables (api keys) will be hidden.
```
git add .
git commit -m "added environment variables"
git push heroku master
```


## Firebase Auth

Create project on Firebase

Get configuration details

Go to Auth - enable e-mail & Password sign in

API config & key is in client, set API permissions to restrict to either domain or IP.


## Selenium
1. Install selenium webdriver
```
npm install selenium-webdriver // one time I just re-ran this and then it worked.

npm install chromedriver --chromedriver-force-download // skips the local temp version and forces a download of the latest package

npm install chromedriver
```
2. download chromedriver zip file from chrome for testing https://googlechromelabs.github.io/chrome-for-testing/ - use the https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/120.0.6099.109/mac-x64/chromedriver-mac-x64.zip
3. unzip the download and extract the chromedriver.exe
4. paste the chromedriver.exe into this repo

archive steps 2-4
2. Download chromedriver from chrome
3. Navigate (using Finder->Go->Go To Folder...) to /usr/local/bin and place chromdriver in folder
4. Test that chromedriver is setup by calling 'chromedriver' from CLI.

## Testing
1. Install jest
```
npm install jest
```
2. Update package.json scripts section with test: 'jest'
```
"scripts":{
  "test": "jest"
}
```
3. Call tests
```
npm test                // run all tests
npm test <myTestFile>   // call individual test file
```

 ## Material UI
 1. install Material UI @ client directory

 ## Scrapers
 ```
	let currentParcel = {
		'Basic' : {
			'PARCEL_NUM' : str,
			'PROPERTY_INFO_LINK' : str,
			'Site Address' : str
			},
		'Building' : {},
		'Tax' : {
			'TAXABLE_LAND' : number,
			'TAXABLE_BUILDING': number,
			'TAXABLE_TOTAL': number
			},
		'Location' : {
			'LAT' : str,
			'LON' : str
			},
		'Land' : {
			'Acres' : number
			},
		'Pictures': {
			[str, str]
		},
		'Meta' : {
			'AUCTION_DATE' = str,
			'AUCTION_INFO_URL' = str,
			'PARCEL_INFO_URL' = str,
			'PARCEL_DATA_BASE_URL' = str,
			'PARCEL_VIEWER_URL' = str,
			'AUCTION_SITE' = str,
			'AUCTION_SITE_FLAG' = str
		}

	};



 ```
 

