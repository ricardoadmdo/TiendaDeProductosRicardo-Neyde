import { createContext, useContext, useState } from 'react';

const ExchangeRatesContext = createContext();

export const useExchangeRates = () => useContext(ExchangeRatesContext);

export const ExchangeRatesProvider = ({ children }) => {
	const [usdRate, setUsdRate] = useState(null);
	const [cupRate, setCupRate] = useState(null);

	return <ExchangeRatesContext.Provider value={{ usdRate, cupRate }}>{children}</ExchangeRatesContext.Provider>;
};
