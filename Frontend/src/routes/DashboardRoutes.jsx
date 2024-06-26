import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import TableSkeleton from '../components/ui/TableSkeleton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import AdminRoute from './AdminRoute.jsx';
const CRUDUsuario = lazy(() => import('../components/usuario/CRUDUsuario.jsx'));
const CRUDProducto = lazy(() => import('../components/producto/CRUDProducto.jsx'));
const CRUDCombo = lazy(() => import('../components/combos/CRUDCombo.jsx'));
const BuscarUsuario = lazy(() => import('../components/usuario/BuscarUsuario.jsx'));
const CRUDVentas = lazy(() => import('../components/ventas/CRUDVentas.jsx'));

const DashboardRoutes = () => {
	return (
		<>
			<Routes>
				<Route
					path='gestionar-usuarios'
					element={
						<AdminRoute>
							<Suspense fallback={<TableSkeleton />}>
								<CRUDUsuario />
							</Suspense>
						</AdminRoute>
					}
				/>
				<Route
					path='gestionar-productos'
					element={
						<AdminRoute>
							<Suspense fallback={<TableSkeleton />}>
								<CRUDProducto />
							</Suspense>
						</AdminRoute>
					}
				/>
				<Route
					path='gestionar-combos'
					element={
						<AdminRoute>
							<Suspense fallback={<TableSkeleton />}>
								<CRUDCombo />
							</Suspense>
						</AdminRoute>
					}
				/>

				<Route
					path='gestionar-ventas'
					element={
						<AdminRoute>
							<Suspense fallback={<LoadingSpinner />}>
								<CRUDVentas />
							</Suspense>
						</AdminRoute>
					}
				/>
				<Route
					path='buscarusuarios'
					element={
						<AdminRoute>
							<Suspense fallback={<TableSkeleton />}>
								<BuscarUsuario />
							</Suspense>
						</AdminRoute>
					}
				/>
			</Routes>
		</>
	);
};
export default DashboardRoutes;
