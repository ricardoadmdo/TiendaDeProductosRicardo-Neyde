import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
		<React.StrictMode>
			<QueryClientProvider client={client}>
				<ReactQueryDevtools />
				<App />
			</QueryClientProvider>
		</React.StrictMode>
	</GoogleOAuthProvider>
);
