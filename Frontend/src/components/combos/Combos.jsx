import { useState, useContext, lazy, Suspense } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Axios from 'axios';
import Pagination from '../reutilizable-tablaCrud/Pagination';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../ui/LoadingSpinner';
import useExchangeRates from '../../hooks/useExchangeRates';
const EmptyProducts = lazy(() => import('../producto/EmptyProducts.jsx'));
const ErrorComponent = lazy(() => import('../ui/ErrorComponent.jsx'));

const fetchCombos = async ({ queryKey }) => {
	const [, page, limit] = queryKey;
	const response = await Axios.get(`http://localhost:3001/api/combo?page=${page}&limit=${limit}`);
	return response.data;
};

const Combos = () => {
	const { usdRate } = useExchangeRates();
	const [cantidad, setCantidad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const { addToCart } = useContext(CartContext);

	const { data: combosData, isLoading, isError, error } = useFetch(['combos', currentPage, 8], fetchCombos, { keepPreviousData: true });

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (combosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}
	if (isError) {
		return (
			<Suspense fallback={<LoadingSpinner />}>
				<ErrorComponent message={error.message} />;
			</Suspense>
		);
	}

	const combosList = combosData?.combos || [];
	const totalPages = combosData?.totalPages || 0;

	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			<div className='row'>
				<h2 className='text-center mb-4'>Combos</h2>
				{combosList.map((val) => (
					<div key={val.uid} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
						<div className='card h-100 shadow'>
							<LazyLoadImage
								threshold={10}
								effect='blur'
								src={val.url}
								className='card-img-top img-fluid'
								alt='Imagen del combo'
								style={{ objectFit: 'cover', height: '200px' }}
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
										<p className='card-text'>{val.description}</p>
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
													className='btn btn-outline-success w-100 btn-animated'
													onClick={() => addToCart(val, Number(cantidad))}
												>
													<FontAwesomeIcon icon={faShoppingCart} />
												</button>
											</div>
										</div>
									</>
								) : (
									<Suspense fallback={<LoadingSpinner />}>
										<EmptyProducts />
									</Suspense>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			<Suspense fallback={<LoadingSpinner />}>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					handlePreviousPage={handlePreviousPage}
					handleNextPage={handleNextPage}
				/>
			</Suspense>
		</div>
	);
};

export default Combos;
