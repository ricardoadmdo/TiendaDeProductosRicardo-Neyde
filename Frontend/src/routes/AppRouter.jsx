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
import { Cafeteria } from '../components/cafeteria/Cafeteria';
import { Perfil } from '../components/ui/Perfil';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/*  //! Rutas de la Cafeteria */}
				<Route path='/cafeteria/*' element={<CafeteriaLayout />}>
					<Route index element={<Cafeteria />} />
					{/* //? Rutas dentro de la ruta /cafeteria */}
				</Route>

				{/*  //! Rutas de la Tienda */}
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Bienvenida />} />
					<Route path='register' element={<RegisterScreen />} />
					<Route path='login' element={<LoginScreen />} />
					<Route path='productos' element={<Productos />} />
					<Route path='carrito' element={<Carrito />} />
					<Route path='combos' element={<Combos />} />
					<Route path='busqueda' element={<Busqueda />} />
					<Route path='perfil' element={<Perfil />} />
					<Route
						path='dashboard/*'
						element={
							<PrivateRoute>
								<DashboardRoutes />
							</PrivateRoute>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
