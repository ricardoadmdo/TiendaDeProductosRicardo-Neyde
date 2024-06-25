import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const LoginScreen = lazy(() => import('../components/login/LoginScreen'));
const RegisterScreen = lazy(() => import('../components/login/RegisterScreen'));
const Bienvenida = lazy(() => import('../components/ui/Bienvenida'));
const Productos = lazy(() => import('../components/producto/Productos'));
const Carrito = lazy(() => import('../components/carrito de compra/Carrito'));
const Combos = lazy(() => import('../components/combos/Combos'));
const Busqueda = lazy(() => import('../components/ui/Busqueda'));
const Perfil = lazy(() => import('../components/ui/Perfil'));
const VerificationScreen = lazy(() => import('../components/login/VerificationScreen'));
const NoEncontrado = lazy(() => import('../components/NoEncontrado.jsx'));
const Cafeteria = lazy(() => import('../components/cafeteria/Cafeteria.jsx'));
const ReporteVentas = lazy(() => import('../components/ventas/ReporteVentas.jsx'));
const Menu = lazy(() => import('../components/cafeteria/Menu.jsx'));
const Boutique = lazy(() => import('../components/Boutique/Boutique.jsx'));
const BoutiqueMenu = lazy(() => import('../components/Boutique/BoutiqueMenu.jsx'));
const CafBusqueda = lazy(() => import('../components/cafeteria/ui/CafBusqueda.jsx'));
const CRUDCafeteria = lazy(() => import('../components/cafeteria/CRUDCafeteria.jsx'));
import BoutiqueLayout from './BoutiqueLayout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import MainLayout from './MainLayout';
import CafeteriaLayout from './CafeteriaLayout';
import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';
import DashboardRoutes from './DashboardRoutes';

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
						<Route path='menu' element={<Menu />} />
						<Route path='cafBusqueda' element={<CafBusqueda />} />
						<Route
							path='reporte-ventas'
							element={
								<PrivateRoute>
									<AdminRoute>
										<ReporteVentas />
									</AdminRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path='gestionar-cafeteria'
							element={
								<PrivateRoute>
									<AdminRoute>
										<CRUDCafeteria />
									</AdminRoute>
								</PrivateRoute>
							}
						/>
						{/* Ruta 404 */}
						<Route path='*' element={<NoEncontrado />} />
					</Route>

					{/* Rutas de la Boutique */}
					<Route path='/boutique/*' element={<BoutiqueLayout />}>
						<Route index element={<Boutique />} />
						<Route path='boutiqueMenu' element={<BoutiqueMenu />} />
					</Route>

					{/* Ruta 404 */}
					<Route path='*' element={<NoEncontrado />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
};

export default AppRouter;
