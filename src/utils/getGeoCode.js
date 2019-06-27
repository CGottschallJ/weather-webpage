
// -- PACKAGE IMPORTS -- //
const request = require('request');

const getGeoCode = (address, callback) => {
	/*	Saving the mapbox request url to a variable to be used later on.
			=> The mapbox API url has a number of parameters that can be added to the end of the url as options.
			=> Those options can be found in the mapbox documentation under the search section.
			=> There are two required parametes including the endpoint and the search text (location).
				-> https://api.mapbox.com/geocoding/v5/[...endpoint]/[...search text].[data type]?access_token=[...access token]&[...another query parameter]=[...desired value]
			=> The encodeURIComponent() function is used to encode special characters which will avoid conflicts with special characters that have meaning in a url structure (i.e. a question mark will become '%3F' and will not be seen as a query parameter). */
	const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_TOKEN}&limit=1`;

	/*	Creating a request to the mapbox api using the request() function of the request package.
			=> The first argument (object) is the options for the request.
			=> There is one required key for the options object which is a 'url' key.
			=> The second argument (function) determines what is done with the data once the request has returned data.
				Note: This argument is an es6 destructured object since only the response.body is being used. */
	request({ url: mapboxUrl, json: true }, (error, { body }) => {
		// Checking for errors
		if (error) {
			// Logging an error to the console in the case that there is no response from the request.
			callback('Unable to connect to the location services at this time.', undefined);

		} else if (body.features.length === 0) {
			// Logging an error to the console in the case that no locations are returned in the features key.
			callback('The location entered is not a valid location. Please check your location and try again.', undefined);

		} else {
			// Saving the latitude and longitude to a variable called geometry.
			const coordinates = body.features[0].geometry.coordinates;

			// Saving the longitude to a variable
			const longitude = coordinates[0];

			// Saving the lattitude to a variable
			const latitude = coordinates[1];

			// Saving the location name to a variable
			const location = body.features[0].place_name;

			// Creating a data object grouping all values together
			const data = { latitude, longitude, location };

			// Calling the callback function. Passing undefined for the error and the data object.
			callback(undefined, data);
		}
	});
}

// Exporting the getGeoCode() function.
module.exports = getGeoCode;