# Office Equipment Manager
The OEM was built to help manage office equipment, what employees are currently using different items, how old items are, etc. It is built with React, Redux, Firebase, Webpack, and React Toolbox.

# Introduction
* Manage Employees (People).
* Manage Hardwares (Make/Model).
* Manage Items, which are individual pieces of office equipment that are a kind of hardware and assigned to a person.
* Mass Import/Export via CSV.
* Sort and Filter Items, People, and Hardwares.

# Setup
1. Clone this repo.
2. Run `npm install`
3. Create a Firebase instance for OEM at https://console.firebase.google.com
	1. Enable Firebase Email/Password Authentication, create a user (This is where users are managed for OEM)
	2. Upload the photos in the **./default images** directory of this repo to Firebase Storage. You want them nexted as such: `images/defaults/*.jpg`
	3. Generate your web API keys, etc. from Firebase and add them to a new file at `app/config/conf.js` as an exported JS object. Like so...
	```
	export const config = {
		apiKey: ...
		authDomain: ...
		databaseURL: ...
		storageBucket: ...
		messagingSenderId: ...
	}
	```
4. For production, run `npm run production` to generate your dist folder. If you wish to modify the app, simply run `npm run start` to get the webpack server running.


# Importing Data
The OEM suppots mass import vi CSV. You just need to make sure your CSV is structured properly in order to do this. You can download an example by clicking on the dropdown menu icon next to *Equipment Manager* in the Appbar, then click on "Download Import Example".