import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/authContext';
import { CartContext } from '../../auth/CartProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faShoppingCart,
	faSignOutAlt,
	faUtensils,
	faHamburger,
	faSearch,
	faStore,
	faCog,
	faShirt,
	faShop,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../../../public/logo.png';
import { types } from '../../types/types';
import { googleLogout } from '@react-oauth/google';

const Navbar = () => {
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
		<nav className='dark101720 navbar navbar-expand-lg navbar-dark shadow'>
			<div className='container'>
				<NavLink className='navbar-brand' to='/'>
					<img className='d-inline-block align-text-top' src={logo} alt='Logo de la tienda' height='45' />
				</NavLink>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='offcanvas'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='offcanvas offcanvas-end dark101720' tabIndex='-1' id='navbarNav' aria-labelledby='offcanvasNavbarLabel'>
					<div className='offcanvas-header'>
						<h5 className='offcanvas-title' id='offcanvasNavbarLabel'>
							Menú
						</h5>
						<button type='button' className='btn-close btn-close-white' data-bs-dismiss='offcanvas' aria-label='Close'></button>
					</div>
					<div className='offcanvas-body'>
						<ul className='navbar-nav'>
							<div className='navbar-nav' style={{ border: '3px solid' }}>
								<li className='nav-item'>
									<NavLink className='nav-link' to='/'>
										<FontAwesomeIcon icon={faShop} />
										<span>Tienda</span>
									</NavLink>
								</li>
								<li className='nav-item position-relative'>
									<NavLink className='nav-link' to='/cafeteria'>
										<FontAwesomeIcon icon={faStore} />
										<span>Cafeteria</span>
									</NavLink>
								</li>
								<li className='nav-item position-relative'>
									<NavLink className='nav-link' to='/boutique'>
										<FontAwesomeIcon icon={faShirt} />
										<span>Boutique</span>
									</NavLink>
								</li>
							</div>
							<span className='me-5' />
							<form className='d-flex me-5' onSubmit={handleSearchSubmit}>
								<input
									type='search'
									name='searchInput'
									className='form-control me-1'
									placeholder='Buscar productos...'
									aria-label='Buscar'
									value={searchTerm}
									onChange={handleSearchChange}
									style={{ width: '226px' }}
								/>

								<button className='btn btn-outline-light' type='submit' aria-label='Buscar'>
									<FontAwesomeIcon icon={faSearch} />
								</button>
							</form>
							<li className='nav-item position-relative'>
								<NavLink className='nav-link' to='/carrito'>
									<FontAwesomeIcon icon={faShoppingCart} />
									{cartItemCount > 0 && (
										<span className='position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success'>
											{cartItemCount}
										</span>
									)}
									<span>Compra</span>
								</NavLink>
							</li>
							<li className='nav-item'>
								<NavLink className='nav-link' to='/productos'>
									<FontAwesomeIcon icon={faHamburger} />
									<span>Productos</span>
								</NavLink>
							</li>
							<li className='nav-item me-5'>
								<NavLink className='nav-link' to='/combos'>
									<FontAwesomeIcon icon={faUtensils} />
									<span>Combos</span>
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
										<FontAwesomeIcon icon={faCog} />
										<span>Gestionar</span>
									</a>
									<ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='navbarDropdownMenuLink'>
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
										<li>
											<NavLink className='dropdown-item' to='/dashboard/gestionar-ventas'>
												Gestionar Ventas
											</NavLink>
										</li>
									</ul>
								</li>
							)}
							{user.logged ? (
								<>
									<li className='nav-item'>
										<button className='nav-link' onClick={handleLogout}>
											<FontAwesomeIcon icon={faSignOutAlt} />
											<span>Cerrar Sesión</span>
										</button>
									</li>
								</>
							) : (
								<li className='nav-item'>
									<NavLink className='nav-link' to='/login'>
										<FontAwesomeIcon icon={faUser} />
										<span>Iniciar Sesión</span>
									</NavLink>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
