import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginScreen } from '../components/login/LoginScreen';
import { RegisterScreen } from '../components/login/RegisterScreen';
import { Bienvenida } from '../components/ui/Bienvenida';
import { Productos } from '../components/producto/Productos';
import { Carrito } from '../components/carrito de compra/Carrito';
import { Combos } from '../components/combos/Combos';
import { Busqueda } from '../components/ui/Busqueda';
import { DashboardRoutes } from './DashboardRoutes';
import { PrivateRoute } from './PrivateRoute';
import MainLayout from './MainLayout';
import CafeteriaLayout from './CafeteriaLayout';
import { Perfil } from '../components/ui/Perfil';
import { VerificationScreen } from '../components/login/VerificationScreen';
import { AdminRoute } from './AdminRoute';
import Ventas from '../components/cafeteria/ventas/Ventas.jsx';
import NoEncontrado from '../components/NoEncontrado.jsx';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rutas de la Tienda */}
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Bienvenida />} />
					<Route path='register' element={<RegisterScreen />} />
					<Route path='login' element={<LoginScreen />} />
					<Route path='productos' element={<Productos />} />
					<Route path='carrito' element={<Carrito />} />
					<Route path='combos' element={<Combos />} />
					<Route path='busqueda' element={<Busqueda />} />
					<Route path='perfil' element={<Perfil />} />
					<Route path='verify-code' element={<VerificationScreen />} />
					<Route
						path='dashboard/*'
						element={
							<PrivateRoute>
								<DashboardRoutes />
							</PrivateRoute>
						}
					/>
				</Route>

				{/* Rutas de la Cafeteria */}
				<Route path='/cafeteria/*' element={<CafeteriaLayout />}>
					<Route index element={<Bienvenida />} />
					<Route path='carrito' element={<Carrito />} />
					<Route
						path='gestionar-ventas'
						element={
							<PrivateRoute>
								<AdminRoute>
									<Ventas />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
				</Route>

				{/* Ruta 404 */}
				<Route path='*' element={<NoEncontrado />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
