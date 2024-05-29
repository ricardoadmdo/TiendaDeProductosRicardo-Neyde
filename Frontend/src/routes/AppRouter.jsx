import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { LoginScreen } from '../components/login/LoginScreen.jsx';
import { DashboardRoutes } from './DashboardRoutes.jsx';
import { PrivateRoute } from './PrivateRoute.jsx';
import { RegisterScreen } from '../components/login/RegisterScreen.jsx';
import { Navbar } from '../components/ui/Navbar.jsx';
import { Bienvenida } from '../components/ui/Bienvenida.jsx';
import { Productos } from '../components/producto/Productos.jsx';
import { Carrito } from '../components/carrito de compra/Carrito.jsx';
import { Combos } from '../components/combos/Combos.jsx';
import { Busqueda } from '../components/ui/Busqueda.jsx';
import Footer from '../components/footer/Footer.jsx';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path='/' element={<Bienvenida />} />
				<Route path='/register' element={<RegisterScreen />} />
				<Route path='/login' element={<LoginScreen />} />
				<Route path='/productos' element={<Productos />} />
				<Route path='/carrito' element={<Carrito />} />
				<Route path='/combos' element={<Combos />} />
				<Route path='/busqueda' element={<Busqueda />} />

				<Route
					path='/*'
					element={
						<PrivateRoute>
							<DashboardRoutes />
						</PrivateRoute>
					}
				/>
			</Routes>
			<Footer className='footer-margin' />
		</BrowserRouter>
	);
};
