//first make sure you have installed axios from npm  create an apiKey on google and use in the API of google while calling an location api's


function createAddressData(data) {
	return `${data.address},${data.city},${data.state},${data.zip},`
		.replace("#", "%23")
		.replace("&", "%26");
}
export const Geolocation = async item => {
	console.log("locationItem>>", item);
	let url;
	let autoCompleteApi = false;
	let autoCompleteDescription;
	if (
		(!item.address || item.address === "") &&
		!item.city &&
		!item.state &&
		!item.zip
	) {
		// If any of the address details are missing, use Google Places Autocomplete API
		autoCompleteApi = true;
		if (item.name) {
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${item.name}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
		}
	} else if (!item.address || !item.city || !item.state || !item.zip) {
		autoCompleteApi = true;
		if (item.address) {
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${item.address}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
		} else if (item.city) {
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${item.city}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
		} else if (item.state) {
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${item.state}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
		} else {
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${item.zip}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
		}
	} else {
		// console.log("run for all", createAddressData(item));
		url = encodeURI(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${createAddressData(
				item
			)}&key=${process.env.GOOGLEMAPSAPIKEY}`
		);
	}
	// Check if URL is defined before making Axios request
	if (url) {
		let res = await axios.get(url);

		if (
			autoCompleteApi &&
			(!res.data || !res.data.predictions || res.data.predictions.length === 0)
		) {
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${item.name}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
			res = await axios.get(url);
		}

		if (autoCompleteApi) {
			// If Google Places Autocomplete API is used, select the first prediction's description
			if (res.data.predictions && res.data.predictions.length > 0) {
				autoCompleteDescription = res.data.predictions[0].description;
			}
		}

		if (autoCompleteDescription) {
			// If an autocomplete description is available, use it in the Geocoding API request
			url = encodeURI(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${autoCompleteDescription}&key=${process.env.GOOGLEMAPSAPIKEY}`
			);
			res = await axios.get(url);
		}

		return res;
	} else {
		// Return an object with a `data` property when URL is undefined
		return { data: null };
	}
};
