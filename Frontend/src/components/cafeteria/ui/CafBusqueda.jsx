import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import placeholder from '../../../images/placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios'; // Importa Axios para hacer las solicitudes HTTP
import useExchangeRates from '../../../hooks/useExchangeRates';
import EmptySearch from '../../ui/EmptySearch';

const CafBusqueda = () => {
	const { usdRate } = useExchangeRates();
	const [resultados, setResultados] = useState([]);
	const [cantidad, setCantidad] = useState(1);
	const location = useLocation(); // Usa useLocation para obtener la ubicación actual
	const query = new URLSearchParams(location.search).get('query'); // Obtén el valor de query aquí

	useEffect(() => {
		setResultados([]); // Limpiar resultados antes de cada búsqueda
		if (query) {
			buscar(query);
		}
	}, [query]);

	// Función para buscar en Cafeteria
	const buscar = (query) => {
		Axios.get(`http://localhost:3001/api/cafeteria/search?query=${query}`)
			.then((response) => {
				setResultados(response.data.productos);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const addToCart = (producto, cantidad) => {
		console.log(`Añadir ${cantidad} de ${producto.nombre} al carrito`);
	};

	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			{resultados.length > 0 ? (
				<>
					<h2 className='text-center mb-4'>Resultados de la Búsqueda</h2>
					<div className='row'>
						{resultados.map((val) => (
							<div key={val.id} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
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
									<h5 className='card-header'>{val.nombre}</h5>
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
												<p className='card-text'>{val.categoria}</p>
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
															className='btn btn-outline-success w-100'
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
				</>
			) : (
				<EmptySearch />
			)}
		</div>
	);
};

export default CafBusqueda;
