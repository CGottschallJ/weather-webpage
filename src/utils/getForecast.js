
// -- PACKAGE IMPORTS -- //
const request = require('request');

const getForecast = (latitude, longitude, callback) => {
	/*	Saving the Dark Sky request url to a variable to be used later on.
			=> The Dark Sky API url has a number of query parameters that can be added to the end of the url as options.
			=> Those options can be found in the Dark Sky documentation.
			=> The query options can be added to the url using key=value pairs preceeded by a question mark (?).
			=> multiple query options can be added separated by an ampersand (&).
				-> https://api.darksky.net/forecast/key/latitude,longitude?key1=value1&key2=value2 */
	const darkSkyUrl = `https://api.darksky.net/forecast/${process.env.DARK_SKY_TOKEN}/${latitude},${longitude}`;


	/*	Creating a request the to dark sky api using the request() function from the request package.
			=> The first argument (object) is the options for the request.
			=> There is one required key for the options object which is a 'url' key.
			=> The second argument (function) determines what is done with the data once the request has returned data. */
	request({ url: darkSkyUrl, json: true }, (error, { body }) => {

		// Checking for errors
		if (error) {
			// Logging an error to the console in the case that there is no response from the request.
			callback('Unable to connect to the weather service at this time. Please check your connection and try again.', undefined);

		} else if (body.error) {
			// Logging an error to the console in the case that the response contains an error key.
			callback('Unable to find this location. Please check your location entry and try again.', undefined);

		} else {
			// Saving the repsonse body currently key to a variable named 'currentWeather'.
			const currentWeather = body.currently;

			// Saving the response body daily key to a variable named 'dailyWeather'.
			const dailyWeather = body.daily;

			// Calling the callback with the error argument as undefined and the data as the message.
			callback(undefined, `${dailyWeather.data[0].summary} It is currently ${currentWeather.temperature} degrees out. There is a ${currentWeather.precipProbability}% chance of rain.`);
		}
	});
}

// Exporting the getForecast() function
module.exports = getForecast;