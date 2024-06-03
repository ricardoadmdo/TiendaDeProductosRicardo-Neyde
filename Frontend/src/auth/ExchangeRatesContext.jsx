import { createContext, useState, useEffect } from 'react';
import apiToke from '../helpers/apiToke'; // Asegúrate de que la ruta sea correcta
import PropTypes from 'prop-types';

const ExchangeRatesContext = createContext();

export const ExchangeRatesProvider = ({ children }) => {
	const [usdRate, setUsdRate] = useState(null);

	useEffect(() => {
		const obtenerTasas = async () => {
			try {
				const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
				const { USD } = await apiToke(currentDate); // Llama a la función para obtener las tasas de cambio
				const usdRateNumber = Number(USD);
				if (!isNaN(usdRateNumber)) {
					setUsdRate(usdRateNumber);
				}
			} catch (error) {
				console.error('Error al obtener las tasas de cambio:', error);
			}
		};

		obtenerTasas();
	}, []);

	return <ExchangeRatesContext.Provider value={{ usdRate }}>{children}</ExchangeRatesContext.Provider>;
};

ExchangeRatesProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ExchangeRatesContext;
