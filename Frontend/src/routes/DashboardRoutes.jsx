import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoute } from './AdminRoute';
import Loading from '../components/Loading';

const CRUDUsuario = lazy(() => import('../components/usuario/CRUDUsuario.jsx'));
const CRUDProducto = lazy(() => import('../components/producto/CRUDProducto.jsx'));
const CRUDCombo = lazy(() => import('../components/combos/CRUDCombo.jsx'));
const BuscarUsuario = lazy(() => import('../components/usuario/BuscarUsuario.jsx'));

const DashboardRoutes = () => {
	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				<Route
					path='gestionar-usuarios'
					element={
						<AdminRoute>
							<CRUDUsuario />
						</AdminRoute>
					}
				/>
				<Route
					path='gestionar-productos'
					element={
						<AdminRoute>
							<CRUDProducto />
						</AdminRoute>
					}
				/>
				<Route
					path='gestionar-combos'
					element={
						<AdminRoute>
							<CRUDCombo />
						</AdminRoute>
					}
				/>
				<Route
					path='buscarusuarios'
					element={
						<AdminRoute>
							<BuscarUsuario />
						</AdminRoute>
					}
				/>
			</Routes>
		</Suspense>
	);
};

export default DashboardRoutes;
