// Saving the weather form from index.hbs in a variable named weatherForm.
const weatherForm = document.querySelector('.section--address-form-block');

/* Setting a load event listener on the document
	=> This will contain event listener creations for other elements when the document is loaded.
		-> This will ensure that the elements exist in the DOM before the even listeners are attached to them. */
document.addEventListener('DOMContentLoaded', () => {
	// Creating a submit listener on the weather form.  This will fire when the user presses enter or clicks the submit button.
	weatherForm.addEventListener('submit', (event) => fetchWeather(event));
});

// Creating a function that will fetch the weather and display it
function fetchWeather(event) {
	// Preventing the default behavior of a form submition. This will prevent a page reload.
	event.preventDefault();

	// Saving the location search input into a variable named weatherSearchInput
	const weatherSearchInput = document.querySelector(".section-address-form-block__input");
	// Saving the container for the error message in an variable named errorMessageContainer
	const errorMessageContainer = document.querySelector(".section--error-message-block");
	// Saving the element where error messages will be printed into a variable named errorMessageElement
	const errorMessageElement = document.querySelector(".section--error-message-block__error-message");
	// Saving the element where the forecast message will be printed into a variable named forecastMessageElement
	const forecastMessageElement = document.querySelector(".forecast-display-block__forecast-message");
	// Saving the element where the loading message will be printed into a variable named loadingMessageElement
	const loadingMessageElement = document.querySelector(".forecast-display-block__loading-message");

	// Saving the text that was entered into the search input in a variable named searchQueryLocation
	const searchQueryLocation = weatherSearchInput.value;

	// Setting the text content of the loadingMessageElement while the fetch is happening
	loadingMessageElement.textContent = 'Loading weather...';
	// Ensuring the text content of the forecast message is empty while the fetch is happening
	forecastMessageElement.textContent = '';
	// Ensuring the text content of the error message is empty while the fetch is happening
	errorMessageElement.textContent = '';


	fetch(`/weather?address=${searchQueryLocation}`)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.error) {
				loadingMessageElement.textContent = '';
				errorMessageElement.textContent = data.error;
				errorMessageContainer.style.display = 'block';

			} else {
				loadingMessageElement.textContent = '';
				forecastMessageElement.textContent = data.forecast;
				errorMessageContainer.style.display = 'none';

			}
		});
}

