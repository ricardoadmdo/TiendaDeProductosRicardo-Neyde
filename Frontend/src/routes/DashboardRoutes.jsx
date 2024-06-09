import { Routes, Route } from 'react-router-dom';
import CRUDUsuario from '../components/usuario/CRUDUsuario.jsx';
import AdminRoute from './AdminRoute.jsx';
import CRUDProducto from '../components/producto/CRUDProducto.jsx';
import CRUDCombo from '../components/combos/CRUDCombo.jsx';
// import { Perfil } from '../components/ui/Perfil.jsx';
import BuscarUsuario from '../components/usuario/BuscarUsuario.jsx';

const DashboardRoutes = () => {
	return (
		<>
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
				{/* <Route
					path='perfil'
					element={
						<AdminRoute>
							<Perfil />
						</AdminRoute>
					}
				/> */}
				<Route
					path='buscarusuarios'
					element={
						<AdminRoute>
							<BuscarUsuario />
						</AdminRoute>
					}
				/>
			</Routes>
		</>
	);
};
export default DashboardRoutes;
