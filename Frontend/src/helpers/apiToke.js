import Axios from 'axios';

const apiToke = async () => {
	const apiKey = 'TU_CLAVE_DE_API';
	const apiUrl = 'https://api.eltoque.com/v1/trmi';
	const fromDate = '2022-10-27 00:00:01'; // Fecha inicial del intervalo de tiempo
	const toDate = '2022-10-27 23:59:01'; // Fecha final del intervalo de tiempo

	try {
		const response = await Axios.get(apiUrl, {
			params: {
				date_from: fromDate,
				date_to: toDate,
			},
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});

		// Procesar la respuesta y extraer las tasas de cambio u otra información relevante
		const exchangeRates = response.data;
		console.log('Tasas de cambio:', exchangeRates);
	} catch (error) {
		console.error('Error al obtener las tasas de cambio:', error);
	}
};

export default apiToke;
