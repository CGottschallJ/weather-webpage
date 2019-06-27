// -- NODE MODULE IMPORTS -- //
const path = require('path');

// -- PACKAGE IMPORTS -- //
const express = require('express');
const hbs = require('hbs');

// -- LOCAL IMPORTS -- //
const getGeoCode = require('./utils/getGeoCode');
const getForecast = require('./utils/getForecast');

// Initializing the express application
const app = express();

// Initializing .env
require('dotenv').config();

// -- EXPRESS CONFIGURATION -- //

/* - Defining filepaths to be used in the express configuration - */
// File path to the public directory
const pathToPublicDirectory = path.join(__dirname, '../public');
// File path to the view directory
const pathToViewsDirectory = path.join(__dirname, '../templates/views');
// File path to the paritals directory
const pathToPartialsDirectory = path.join(__dirname, '../templates/partials');


/* - Setting up handlebars views and partials - */
/*	Telling express which templating engine that we have installed with the app.set() method.
	=> The app.set() method allows you to set a value to any of the app settings.
		-> The app.set() method takes in two arguments.
		-> The first is the key (or setting) that you would like to set.
		-> The second is the value that you would like that setting to have.
	=> In this case, we are setting the apps view engine to be hbs (short for handlebars) */
app.set('view engine', 'hbs');
// Setting the application views setting to search for the views in the pathToViewsDirectory file path defined above
app.set('views', pathToViewsDirectory);
// Registering partials with the hbs package module so that it knows to look in the pathToPartialsDirectory file path for templating partials.
hbs.registerPartials(pathToPartialsDirectory);


/* - Setting up the static directory to serve for assets - */
// Serving the public directory
app.use(express.static(pathToPublicDirectory));


// -- ROUTE DEFINITIONS -- //

/* -- Home Page -- 
	Using the app.get() method to setup a route for the applications home page route.
	=> Inside of the route method, the index template is being rendered using the response.render() method.
		-> The response.render() method takes in two arguments.
		-> The first is the name of the template that is to be rendered when this url is navigated to
		-> The second is an object containing all values that should be passed into that template for dynamic use. */
app.get('/', (request, response) => {
	response.render('index', {
		appName: 'Weather Application',
		pageTitle: 'Weather',
	});
});

/* -- About Page -- 
	Using the app.get() method to setup a route for the applications about page route.
	=> Inside of the route method, the index template is being rendered using the response.render() method.
		-> The response.render() method takes in two arguments.
		-> The first is the name of the template that is to be rendered when this url is navigated to
		-> The second is an object containing all values that should be passed into that template for dynamic use. */
app.get('/about', (request, response) => {
	response.render('about', {
		appName: 'Weather Application',
		pageTitle: 'About',
		profilePhotoURL: '/assets/images/personal-photo.jpg'
	});
});

/* -- Help Page -- 
	Using the app.get() method to setup a route for the applications help page route.
	=> Inside of the route method, the index template is being rendered using the response.render() method.
		-> The response.render() method takes in two arguments.
		-> The first is the name of the template that is to be rendered when this url is navigated to
		-> The second is an object containing all values that should be passed into that template for dynamic use. */
app.get('/help', (request, response) => {
	response.render('help', {
		appName: 'Weather Application',
		pageTitle: 'Help',
	});
});

// Creating help 404 route
app.get('/help/*', (request, response) => {
	response.render('404', {
		errorMessage: 'This help article is not available.',
		returnPath: '/help',
		returnPageName: 'Help',
		pageTitle: 'Help'
	})
});

// Weather Page
// => Creating an app.get() method to handle what is displayed on the weather page route.
app.get('/weather', (request, response) => {
	// Returning the response.send so that it does not continue through the method which would call a second response.send
	// If response.send is called twice, it will result in a javascript error.
	if (!request.query.address) {
		return response.send({
			error: 'Please enter an address or a city to get an accurate forecast.'
		});
	}

	const userQueryLocation = request.query.address;

	/* Calling the getGeoCode function
		=> Passing in the location that the user entered and a callback function.
		=> The callback function takes in two arguments
			-> An error
			-> A destructured object containing the latitude, longitude, and location returned from the API call.
				:> Additionally, a default value of an empty object has been set in the case that there is no information available.
				:> This will prevent a javascript error and allow the script to run properly */
	getGeoCode(userQueryLocation, (error, { latitude, longitude, location } = {}) => {
		// Logging an error to the console if the error parameter is not undefined.
		if (error) {
			return response.send({ error });
		}

		/*	Calling the imported getForecast() function and defining the callback function that it will use.
			=> The getForecast() function takes in three arguments
				-> The first is the latitude which is part of the geoCodeData returned from the API request in the getGeoCode() function.
				-> The second is the longitude which is part of the geoCodeData returned from the API request in the getGeoCode() function.
				-> The third is the definition of a callback function.
					:> The are two arguments being passed into the callback function.
					:> The first is any error that may result from the API request that happens within the getForecast() function.
					:> The second is data that has been returned from the API request that happens within the getForecast() function in the case there is no error. */
		getForecast(latitude, longitude, (error, forecastData) => {
			// Logging an error to the console if the error parameter is not undefined.
			if (error) {
				return response.send({ error });
			}
			// If a search query parameter was given, then the server sends a response containing data returned from the API.
			response.send({
				forecast: forecastData,
				location: location,
				address: request.query.address
			});
		});
	});
});

/* -- 404 Pages -- 
	The route for 404 pages MUST be the final route that is setup due to the order in which express reads this file.
	=> The first argument passed in should be '*', which means to match anything.
		-> If this route were placed before another, the other would never be reached as this one would match before it.
		-> Express reads the file from the top down which means this essentially catches anything that was not matched above.		
	=> Creating an app.get() method route to handle 404 pages. */
app.get('*', (request, response) => {
	response.render('404', {
		errorMessage: 'Page not found',
		returnPath: '/',
		returnPageName: 'Home'
	});
});

// -- PORT INITIALIZAITON -- //

// Defining the port number
const port = process.env.PORT || 3000;

// Starting the server on the port number defined above and printing an informative message to the console.
app.listen(port, () => {
	console.log(`The server is lisening on port:${port}`);
});