import { useContext } from 'react';
import ExchangeRatesContext from './ExchangeRatesContext';

const useExchangeRates = () => {
	return useContext(ExchangeRatesContext);
};

export default useExchangeRates;
