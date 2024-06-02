const { response, request } = require('express');
const Axios = require('axios');

const googleLocation = async (req = response, res = request) => {
	const { latitude, longitude } = req.query;
	const apiKey = process.env.GOOGLE_API_KEY;

	try {
		const apiResponse = await Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
		console.log(apiResponse);
		if (apiResponse.data && apiResponse.data.results && apiResponse.data.results.length > 0) {
			const addressComponents = apiResponse.data.results[0].address_components;

			if (addressComponents) {
				const countryComponent = addressComponents.find((component) => component.types.includes('country'));
				const country = countryComponent ? countryComponent.short_name : null;
				res.json({ country });
			} else {
				res.status(404).send('No address components found');
			}
		} else {
			res.status(404).send('No results found');
		}
	} catch (error) {
		console.error(error);
		res.status(500).send('Error obtaining the country');
	}
};

module.exports = {
	googleLocation,
};
