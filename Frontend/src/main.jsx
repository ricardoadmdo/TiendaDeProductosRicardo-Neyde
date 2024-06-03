import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ExchangeRatesProvider } from './auth/ExchangeRatesContext.jsx';

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: true, // Vuelve a buscar datos cuando se restablece la conexión
			retry: 1, // Reintenta una vez en caso de error
			cacheTime: 1000 * 60 * 10, // 10 minutes
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<QueryClientProvider client={client}>
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
				<ExchangeRatesProvider>
					<App />
				</ExchangeRatesProvider>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	</React.StrictMode>
);
