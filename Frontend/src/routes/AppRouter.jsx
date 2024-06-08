import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import MainLayout from './MainLayout';
import CafeteriaLayout from './CafeteriaLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

// Lazy loading components
const LoginScreen = lazy(() => import('../components/login/LoginScreen'));
const RegisterScreen = lazy(() => import('../components/login/RegisterScreen'));
const Bienvenida = lazy(() => import('../components/ui/Bienvenida'));
const Productos = lazy(() => import('../components/producto/Productos'));
const Carrito = lazy(() => import('../components/carrito de compra/Carrito'));
const Combos = lazy(() => import('../components/combos/Combos'));
const Busqueda = lazy(() => import('../components/ui/Busqueda'));
const DashboardRoutes = lazy(() => import('./DashboardRoutes'));
const Perfil = lazy(() => import('../components/ui/Perfil'));
const VerificationScreen = lazy(() => import('../components/login/VerificationScreen'));
const Ventas = lazy(() => import('../components/cafeteria/ventas/Ventas.jsx'));
const NoEncontrado = lazy(() => import('../components/NoEncontrado.jsx'));
const Cafeteria = lazy(() => import('../components/cafeteria/Cafeteria.jsx'));

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingSpinner />}>
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
						{/* Ruta 404 */}
						<Route path='*' element={<NoEncontrado />} />
					</Route>

					{/* Rutas de la Cafeteria */}
					<Route path='/cafeteria/*' element={<CafeteriaLayout />}>
						<Route index element={<Cafeteria />} />
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
						{/* Ruta 404 */}
						<Route path='*' element={<NoEncontrado />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
};

export default AppRouter;
