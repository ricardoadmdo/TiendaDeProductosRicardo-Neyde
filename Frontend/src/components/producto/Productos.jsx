import { useState, useContext } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Axios from 'axios';
import placeholder from '../../images/placeholder.png';
import './styles.css';
import Pagination from '../reutilizable-tablaCrud/Pagination';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../ui/LoadingSpinner';
import useExchangeRates from '../../hooks/useExchangeRates';

const fetchProductos = async ({ queryKey }) => {
	const [, page, limit] = queryKey;
	const response = await Axios.get(`http://localhost:3001/api/product?page=${page}&limit=${limit}`);
	return response.data;
};

const Productos = () => {
	const { usdRate } = useExchangeRates();
	const [cantidad, setCantidad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const { addToCart } = useContext(CartContext);

	const { data: productosData, isLoading, isError, error } = useFetch(['productos', currentPage, 8], fetchProductos, { keepPreviousData: true });

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (productosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	if (isLoading) {
		// Muestra un mensaje de carga mientras se obtienen los datos
		return <LoadingSpinner />;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const productosList = productosData?.productos || [];
	const totalPages = productosData?.totalPages || 0;

	// const getUserLocation = () => {
	// 	navigator.geolocation.getCurrentPosition(success, error);

	// 	function success(position) {
	// 		const { latitude, longitude } = position.coords;
	// 		getCountry(latitude, longitude);
	// 	}

	// 	function error() {
	// 		console.log('No se pudo obtener la ubicación');
	// 	}

	// 	const getCountry = async (latitude, longitude) => {
	// 		try {
	// 			const response = await Axios.get('http://localhost:3001/api/location/get-country', {
	// 				params: { latitude, longitude },
	// 			});
	// 			console.log(response);
	// 			const country = response.data.country;
	// 			setCurrency(country === 'CU' ? 'CUP' : 'USD');
	// 		} catch (error) {
	// 			console.error('Error obteniendo el país:', error);
	// 		}
	// 	};
	// };

	// const formatPrice = (price) => {
	// 	if (currency === 'CUP') {
	// 		return `${(price * exchangeRate).toFixed(2)} CUP`;
	// 	}
	// 	return `${price} USD`;
	// };
	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			<div className='row'>
				<h2 className='text-center mb-4'>Productos</h2>
				{productosList.length > 0 ? (
					productosList.map((val) => (
						<div key={val.uid} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
							<div className='card h-100 shadow'>
								<LazyLoadImage
									threshold={10}
									effect='blur'
									placeholderSrc={placeholder}
									src={val.url}
									className='card-img-top img-fluid'
									alt='Imagen del producto'
									style={{ height: '200px', objectFit: 'cover' }}
								/>
								<h3 className='card-header'>{val.nombre}</h3>
								<div className='card-body'>
									{val.cantidad > 0 ? (
										<>
											<strong>
												<p className='card-text'>{val.precio}$ CUP</p>
											</strong>
											<strong>
												<p className='card-text'>{usdRate ? (val.precio / usdRate).toFixed(2) : 'N/A'}$ USD</p>
											</strong>
											<hr />
											<div className='row align-items-center'>
												<div className='col-6'>
													<input
														type='number'
														className='form-control'
														placeholder='Cantidad'
														min='1'
														defaultValue='1'
														onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
													/>
												</div>
												<div className='col-6'>
													<button
														aria-label='añadir al carrito'
														className='btn btn-outline-dark w-100 btn-animated'
														onClick={() => addToCart(val, cantidad)}
													>
														<FontAwesomeIcon icon={faShoppingCart} />
													</button>
												</div>
											</div>
										</>
									) : (
										<div className='text-center'>
											<strong className='text-uppercase text-center' style={{ fontSize: '1.5rem' }}>
												Agotado
											</strong>
										</div>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className='text-center'>
						<h2>No se encontraron productos</h2>
					</div>
				)}
			</div>
			<Pagination currentPage={currentPage} totalPages={totalPages} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} />
		</div>
	);
};

export default Productos;
