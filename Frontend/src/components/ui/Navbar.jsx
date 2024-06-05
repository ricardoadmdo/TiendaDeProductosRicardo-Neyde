import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/authContext';
import { CartContext } from '../../auth/CartProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSignOutAlt, faUtensils, faHamburger, faSearch, faStore } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../public/logo.png';
import { types } from '../../types/types';
import { googleLogout } from '@react-oauth/google';

export const Navbar = () => {
	const { user, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const { cart } = useContext(CartContext);
	const [cartItemCount, setCartItemCount] = useState(0);

	useEffect(() => {
		const totalItems = cart.reduce((total, item) => total + item.cantidadAdd, 0);
		setCartItemCount(totalItems);
	}, [cart]);

	const handleLogout = () => {
		if (user.google) {
			// Verifica si el usuario inició sesión con Google
			googleLogout(); // Si inició sesión con Google, utiliza la función de logout de Google
		} else {
			// Si no inició sesión con Google, limpia los datos de sesión
			dispatch({ type: types.logout });
		}
		// Redirige al usuario a la página de inicio
		navigate('/', { replace: true });
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/busqueda?query=${searchTerm}`);
	};

	return (
		<nav className='navbar navbar-expand-lg navbar-dark shadow'>
			<div className='container'>
				<NavLink className='navbar-brand' to='/'>
					<img src={logo} alt='Logo de la tienda' style={{ height: '50px' }} />
				</NavLink>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarNav'>
					<form className='d-flex me-auto mb-2 mb-lg-0' onSubmit={handleSearchSubmit}>
						<input
							type='search'
							name='searchInput'
							className='form-control me-1'
							placeholder='Buscar productos...'
							aria-label='Buscar'
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<button className='btn btn-outline-light' type='submit' aria-label='Buscar'>
							<FontAwesomeIcon icon={faSearch} />
						</button>
					</form>

					<ul className='navbar-nav'>
						<NavLink className='nav-link' to='/'>
							<FontAwesomeIcon icon={faStore} />
							Tienda
						</NavLink>

						<li className='nav-item position-relative me-5'>
							<NavLink className='nav-link' to='/cafeteria'>
								<FontAwesomeIcon icon={faStore} />
								Cafeteria
							</NavLink>
						</li>
						<li className='nav-item position-relative'>
							<NavLink className='nav-link' to='/carrito'>
								<FontAwesomeIcon icon={faShoppingCart} />
								{cartItemCount > 0 && (
									<span className='position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success'>
										{cartItemCount}
									</span>
								)}
								Compra
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/productos'>
								<FontAwesomeIcon icon={faHamburger} />
								Productos
							</NavLink>
						</li>
						<li className='nav-item me-5'>
							<NavLink className='nav-link' to='/combos'>
								<FontAwesomeIcon icon={faUtensils} />
								Combos
							</NavLink>
						</li>

						{user.rol === 'ADMIN_ROLE' && (
							<li className='nav-item dropdown me-2'>
								<a
									className='nav-link dropdown-toggle'
									href='#'
									id='navbarDropdownMenuLink'
									role='button'
									data-bs-toggle='dropdown'
									aria-expanded='false'
								>
									Gestionar⚙
								</a>
								<ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
									<li>
										<NavLink className='dropdown-item' to='/dashboard/gestionar-usuarios'>
											Gestionar Usuarios
										</NavLink>
									</li>
									<li>
										<NavLink className='dropdown-item' to='/dashboard/gestionar-productos'>
											Gestionar Productos
										</NavLink>
									</li>
									<li>
										<NavLink className='dropdown-item' to='/dashboard/gestionar-combos'>
											Gestionar Combos
										</NavLink>
									</li>
								</ul>
							</li>
						)}

						{user.logged ? (
							<>
								<li className='nav-item'>
									<NavLink className='nav-link' to='/dashboard/perfil'>
										<FontAwesomeIcon icon={faUser} />
										{user.nombre}
									</NavLink>
								</li>
								<li className='nav-item'>
									<button className='nav-link' onClick={handleLogout}>
										<FontAwesomeIcon icon={faSignOutAlt} />
										Cerrar Sesión
									</button>
								</li>
							</>
						) : (
							<li className='nav-item'>
								<NavLink className='nav-link' to='/login'>
									<FontAwesomeIcon icon={faUser} />
									Iniciar Sesión
								</NavLink>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
