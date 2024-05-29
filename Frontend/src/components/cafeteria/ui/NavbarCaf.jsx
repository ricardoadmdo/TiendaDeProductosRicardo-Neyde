import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../../auth/CartProvider.jsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../auth/authContext.jsx';
import { types } from '../../../types/types.jsx';
import logo from '../../../../public/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSignOutAlt, faUtensils, faHamburger, faSearch, faStore } from '@fortawesome/free-solid-svg-icons';

export const NavbarCaf = () => {
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
		dispatch({ type: types.logout });
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
		<nav className='navbar navbar-expand-lg navbar-dark bg-danger shadow'>
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
							placeholder='Buscar en la cafeteria...'
							aria-label='Buscar'
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<button className='btn btn-outline-light' type='submit'>
							<FontAwesomeIcon icon={faSearch} />
						</button>
					</form>

					<ul className='navbar-nav'>
						<li className='nav-item position-relative'>
							<NavLink className='nav-link' to='/cafeteria'>
								<FontAwesomeIcon icon={faStore} />
								Cafeteria
							</NavLink>
						</li>
						<li className='nav-item position-relative'>
							<NavLink className='nav-link' to='/carrito'>
								<FontAwesomeIcon icon={faShoppingCart} />
								{cartItemCount > 0 && (
									<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success'>
										{cartItemCount}
									</span>
								)}
								Compra
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/productos'>
								<FontAwesomeIcon icon={faHamburger} />
								Pastas
							</NavLink>
						</li>
						<li className='nav-item me-5'>
							<NavLink className='nav-link' to='/combos'>
								<FontAwesomeIcon icon={faUtensils} />
								Comida cubana
							</NavLink>
						</li>
						<li className='nav-item me-5'>
							<NavLink className='nav-link' to='/combos'>
								<FontAwesomeIcon icon={faUtensils} />
								Carnes
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
									Gestionar
								</a>
								<ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
									<li>
										<NavLink className='dropdown-item' to='/gestionar-usuarios'>
											Gestionar Inventario
										</NavLink>
									</li>
									<li>
										<NavLink className='dropdown-item' to='/gestionar-productos'>
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
