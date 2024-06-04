import { ExchangeRatesProvider } from './auth/ExchangeRatesContext';
import { AuthProvider } from './auth/authContext.jsx';
import { CartProvider } from './auth/CartProvider';
import { AppRouter } from './routes/AppRouter.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';

function App() {
	return (
		<ExchangeRatesProvider>
			<AuthProvider>
				<CartProvider>
					<AppRouter />
				</CartProvider>
			</AuthProvider>
		</ExchangeRatesProvider>
	);
}

export default App;
