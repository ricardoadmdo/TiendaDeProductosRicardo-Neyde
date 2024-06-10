import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../../auth/CartProvider.jsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../auth/authContext.jsx';
import { types } from '../../../types/types.jsx';
import logo from '../../../../public/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSignOutAlt, faSearch, faStore, faCog, faShop, faShirt, faChartBar } from '@fortawesome/free-solid-svg-icons';

const NavbarCaf = () => {
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
								{' '}
								<NavLink className='nav-link' to='/'>
									<FontAwesomeIcon icon={faShop} />
									Tienda
								</NavLink>
								<li className='nav-item position-relative'>
									<NavLink className='nav-link' to='/cafeteria'>
										<FontAwesomeIcon icon={faStore} />
										Cafetería
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
									placeholder='Buscar en la cafeteria...'
									aria-label='Buscar'
									value={searchTerm}
									onChange={handleSearchChange}
									style={{ width: '226px' }}
								/>
								<button className='btn btn-outline-light' type='submit'>
									<FontAwesomeIcon icon={faSearch} />
								</button>
							</form>
							<li className='nav-item position-relative'>
								<NavLink className='nav-link' to='/cafeteria/carrito'>
									<FontAwesomeIcon icon={faShoppingCart} />
									{cartItemCount > 0 && (
										<span className='position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success'>
											{cartItemCount}
										</span>
									)}
									Compra
								</NavLink>
							</li>
							<li className='nav-item dropdown me-5'>
								<NavLink className='nav-link' to='/cafeteria/menu'>
									<FontAwesomeIcon icon={faChartBar} />
									Menú
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
										Gestionar
									</a>
									<ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='navbarDropdownMenuLink'>
										<li>
											<NavLink className='dropdown-item' to='/cafeteria/gestionar-inventario'>
												Gestionar Inventario
											</NavLink>
										</li>
										<li>
											<NavLink className='dropdown-item' to='/cafeteria/reporte-ventas'>
												Reporte Ventas
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
			</div>
		</nav>
	);
};

export default NavbarCaf;
