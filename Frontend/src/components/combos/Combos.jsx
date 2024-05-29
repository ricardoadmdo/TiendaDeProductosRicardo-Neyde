import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Axios from 'axios';
import placeholder from '../../images/placeholder.png';

export const Combos = () => {
	const [cantidad, setCantidad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [combosList, setCombos] = useState([]);
	const { addToCart } = useContext(CartContext);

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			getCombos(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			getCombos(currentPage + 1);
		}
	};

	useEffect(() => {
		getCombos();
	});

	const getCombos = (page = 1, limit = 8) => {
		Axios.get(`http://localhost:3001/api/combo?page=${page}&limit=${limit}`)
			.then((response) => {
				const { combos, totalPages, page } = response.data;
				setCombos(combos);
				setTotalPages(totalPages);
				setCurrentPage(page);
			})
			.catch((error) => {
				console.log(error);
			});
	};

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
								placeholderSrc={placeholder}
								src={val.url}
								className='card-img-top img-fluid'
								alt='Imagen del combo'
								style={{ height: '200px', objectFit: 'cover' }}
							/>
							<h5 className='card-header'>{val.nombre}</h5>
							<div className='card-body'>
								{val.cantidad > 0 ? (
									<>
										<p className='card-text'>{val.precio} CUP</p>
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
									<div className='text-center'>
										<strong className='text-uppercase text-center' style={{ fontSize: '1.5rem' }}>
											Agotado
										</strong>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			{/* Controles de paginación */}
			<div className='d-flex justify-content-center mt-4'>
				<button className='btn btn-outline-primary mr-2 me-2' onClick={handlePreviousPage} disabled={currentPage === 1}>
					Anterior
				</button>
				<span className='align-self-center me-2'>
					{currentPage} de {totalPages}
				</span>
				<button className='btn btn-outline-primary ml-2' onClick={handleNextPage} disabled={currentPage === totalPages}>
					Siguiente
				</button>
			</div>
		</div>
	);
};
