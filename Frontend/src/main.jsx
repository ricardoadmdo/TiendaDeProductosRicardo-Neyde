import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
	<GoogleOAuthProvider clientId='940013621400-b89vssru3hf29u32m71tao9amlnjbqoh.apps.googleusercontent.com'>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</GoogleOAuthProvider>
);
