import Axios from 'axios';

const apiToke = async (currentDate) => {
	const apiKey = import.meta.env.VITE_API_TOKE;
	const apiUrl = '/api/v1/trmi';
	const fromDate = `${currentDate} 00:00:01`; // Fecha inicial del intervalo de tiempo
	const toDate = `${currentDate} 23:59:01`; // Fecha final del intervalo de tiempo

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
		const { USD } = response.data.tasas; // Ajusta esto según los datos que necesites
		return { USD }; // Retorna los datos necesarios
	} catch (error) {
		console.error('Error al obtener las tasas de cambio:', error);
		throw error; // Lanza el error para que el componente lo maneje
	}
};

export default apiToke;
