import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { AuthContext } from '../../auth/authContext';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faMapMarkerAlt, faCreditCard, faUsd } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../ui/LoadingSpinner';
import municipiosRepartos from '../../helpers/municipiosRepartos';
import useExchangeRates from '../../hooks/useExchangeRates';
import TermsAndConditions from './TermsAndConditions';

export const Carrito = () => {
	const { usdRate } = useExchangeRates();
	const [loading, setLoading] = useState(false);
	const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
	const { user } = useContext(AuthContext); // Utiliza AuthContext para verificar el estado de inicio de sesión
	const location = useLocation();
	const [recipient, setRecipient] = useState({
		name: '',
		mobile: '',
		address: '',
		municipio: '',
		nota: '',
		reparto: '',
		termsAccepted: false,
	});

	// Calcula el total general de la compra
	const total = cart.reduce((acc, val) => acc + val.precio * val.cantidadAdd, 0);

	// Función para actualizar la cantidad de un producto en el carrito
	const changeQuantity = (id, delta) => {
		updateQuantity(id, delta);
	};

	const handleInputChange = (e) => {
		const { name, value, checked, type } = e.target;
		setRecipient({
			...recipient,
			[name]: type === 'checkbox' ? checked : value,
		});
		if (name === 'municipio') {
			setRecipient({ ...recipient, municipio: value, reparto: '' });
		}
	};

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const status = query.get('status');

		if (status === 'success') {
			Swal.fire({
				title: 'Compra Satisfactoria',
				text: 'Gracias por comprar en Ricardo & Neyde',
				icon: 'success',
			});
			//Limpiamos el carrito
			clearCart();
		} else if (status === 'cancel') {
			Swal.fire({
				title: 'Compra Cancelada',
				text: 'Su compra ha sido cancelada.',
				icon: 'error',
			});
		}
	}, [location]);

	const finalizeOrder = () => {
		if (!user.logged) {
			Swal.fire({ title: 'Inicia Sesión', text: 'No has iniciado sesión!', icon: 'warning' });
			return;
		}

		// Verificar que todos los campos estén llenos y que los términos y condiciones estén aceptados
		if (
			!recipient.name ||
			!recipient.mobile ||
			!recipient.address ||
			!recipient.municipio ||
			!recipient.reparto ||
			!recipient.nota ||
			!recipient.termsAccepted
		) {
			Swal.fire({
				title: 'Formulario Incompleto',
				text: 'Por favor, completa todos los campos y acepta los términos y condiciones.',
				icon: 'error',
			});
			return;
		}

		//TODO: FALTA LA LÓGICA DE COMPLETAR LA COMPRA POR AHORA UN SWEETALERT

		// Mostrar mensaje de compra satisfactoria
		Swal.fire({
			title: 'Compra Satisfactoria',
			text: 'Gracias por comprar en Ricardo & Neyde',
			icon: 'success',
		}).then(() => {
			// Restablecer los valores del formulario
			setRecipient({
				name: '',
				mobile: '',
				address: '',
				municipio: '',
				nota: '',
				reparto: '',
				termsAccepted: false,
			});

			// Vaciar el carrito de compra
			clearCart();
		});
	};

	const pagoOnline = async () => {
		setLoading(true);
		// Verificar que todos los campos estén llenos y que los términos y condiciones estén aceptados
		// if (!recipient.name || !recipient.mobile || !recipient.address || !recipient.municipio || !recipient.nota || !recipient.termsAccepted) {
		// 	Swal.fire({
		// 		title: 'Formulario Incompleto',
		// 		text: 'Por favor, completa todos los campos y acepta los términos y condiciones.',
		// 		icon: 'error',
		// 	});
		// 	return;
		// }

		if (cart.length === 0) {
			Swal.fire({ title: 'El carrito esta vacío', text: 'Añada elementos a su compra', icon: 'warning' });
			return;
		}

		if (!user.logged) {
			Swal.fire({ title: 'Inicia Sesión', text: 'No has iniciado sesión!', icon: 'warning' });
			return;
		}

		try {
			await Axios.post('http://localhost:3001/api/pago/create-checkout-session', { cartItems: cart, usdRate })
				.then((response) => {
					window.location.href = response.data.url;
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			Swal.fire({
				title: 'Error',
				text: 'Ha ocurrido un error con su compra',
				icon: 'error',
			});
			console.error('Error en el pago:', error);
		}
	};

	return (
		<>
			{loading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='container my-5'>
						<div className='row '>
							{/* Sección de productos a la izquierda */}
							<div className='col-lg-8 animate__animated animate__fadeIn'>
								<div className='row'>
									{cart.map((val) => (
										<div key={val.uid} className='col-sm-6 col-md-4 col-lg-4 mb-3'>
											<div className='card h-100 shadow'>
												<img
													src={val.url}
													className='card-img-top img-fluid'
													alt={val.nombre}
													style={{ height: '200px', objectFit: 'cover' }}
												/>
												<h5 className='card-header'>{val.nombre}</h5>
												<div className='card-body'>
													<div className='card-text'>
														<strong>
															<p className='card-text'>{val.precio}$ CUP</p>
														</strong>
														<strong>
															<p className='card-text'>
																{usdRate ? Math.round((val.precio / usdRate) * 10) / 10 : 'N/A'}$ USD
															</p>
														</strong>
													</div>
													<p className='card-text'>
														<strong>Cantidad a comprar:</strong> {val.cantidadAdd}
													</p>
													<p className='card-text'>
														<strong>Subtotal:</strong> {val.precio * val.cantidadAdd} CUP
													</p>
													<p className='card-text'>
														<strong>Subtotal :</strong>{' '}
														{usdRate ? ((val.precio * val.cantidadAdd) / usdRate).toFixed(2) : 'N/A'} USD
													</p>
													<hr />
													<div className='row align-items-center'>
														<div className='col-2'>
															<button
																className='btn btn-secondary'
																onClick={() => changeQuantity(val.uid, -1)}
																disabled={val.cantidadAdd <= 1}
															>
																-
															</button>
														</div>
														<div className='col-4'>
															<button className='btn btn-secondary' onClick={() => changeQuantity(val.uid, 1)}>
																+
															</button>
														</div>
														<div className='col-4'>
															<button className='btn btn-danger' onClick={() => removeFromCart(val.uid)}>
																<FontAwesomeIcon icon={faTrashAlt} />
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Sección del formulario de pedido a la derecha */}

							<div className='col-lg-4'>
								<div className='card p-3 mb-2'>
									<div className='text-center mb-3'>
										<h5>Valor Total de la Compra</h5>
									</div>
									<div className='d-flex justify-content-between align-items-center'>
										<div>
											<h5 className='m-0'>
												<FontAwesomeIcon icon={faUsd} />
												{total} CUP
											</h5>
										</div>
										<div>
											<h5 className='m-0'>
												<FontAwesomeIcon icon={faUsd} />
												{(total / usdRate).toFixed(2)} USD
											</h5>
										</div>
									</div>
								</div>
								<hr />
								<h3 className='mb-4'>Información de Entrega</h3>
								<form>
									<div className='mb-3'>
										<input
											type='text'
											className='form-control'
											name='name'
											placeholder='Nombre del receptor'
											value={recipient.name}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='mb-3'>
										<input
											type='number'
											className='form-control'
											name='mobile'
											placeholder='Teléfono móvil'
											value={recipient.mobile}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='mb-3'>
										<input
											type='text'
											className='form-control'
											name='address'
											placeholder='Dirección exacta'
											value={recipient.address}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='mb-3'>
										<select
											className='form-control'
											name='municipio'
											value={recipient.municipio}
											onChange={handleInputChange}
											required
										>
											<option value=''>Seleccione un municipio</option>
											{Object.keys(municipiosRepartos).map((municipio) => (
												<option key={municipio} value={municipio}>
													{municipio}
												</option>
											))}
										</select>
									</div>
									<div className='mb-3'>
										<select
											className='form-control'
											name='reparto'
											value={recipient.reparto}
											onChange={handleInputChange}
											required
											disabled={!recipient.municipio}
										>
											<option value=''>Seleccione el barrio</option>
											{recipient.municipio &&
												municipiosRepartos[recipient.municipio].map((reparto) => (
													<option key={reparto} value={reparto}>
														{reparto}
													</option>
												))}
										</select>
									</div>
									<div className='mb-3'>
										<input
											type='text'
											className='form-control'
											name='nota'
											placeholder='Escribe alguna nota para el mensajero..'
											value={recipient.nota}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='form-check mb-4'>
										<input
											type='checkbox'
											className='form-check-input'
											name='termsAccepted'
											checked={recipient.termsAccepted}
											id='termsAccepted'
											onChange={handleInputChange}
											required
										/>
										<label className='form-check-label me-3' htmlFor='termsAccepted'>
											Acepto Términos y Condiciones.
										</label>
										<button type='button' className='btn btn-link p-0' data-toggle='modal' data-target='#termsModal'>
											Ver Términos
										</button>
									</div>

									{/* Modal con los términos y condiciones */}
									<div
										className='modal fade'
										id='termsModal'
										tabIndex='-1'
										role='dialog'
										aria-labelledby='termsModalLabel'
										aria-hidden='true'
									>
										<div className='modal-dialog' role='document'>
											<div className='modal-content'>
												<div className='modal-header'>
													<h5 className='modal-title' id='termsModalLabel'>
														Términos y Condiciones
													</h5>
													<button type='button' className='close' data-dismiss='modal' aria-label='Close'>
														<span aria-hidden='true'> &times;</span>
													</button>
												</div>
												<div className='modal-body'>
													<TermsAndConditions />
												</div>

												<div className='modal-footer'>
													<button type='button' className='btn btn-secondary' data-dismiss='modal'>
														Cerrar
													</button>
												</div>
											</div>
										</div>
									</div>
									<div className='d-grid gap-2'>
										<button type='button' className='btn btn-outline-dark btn-lg custom-button' onClick={finalizeOrder}>
											<FontAwesomeIcon icon={faMapMarkerAlt} /> Pago Presencial
										</button>
										<button type='button' className='btn btn-outline-dark btn-lg custom-button mt-2' onClick={pagoOnline}>
											<FontAwesomeIcon icon={faCreditCard} /> Pago con Tarjeta
										</button>
										<hr />
										<button type='button' className='btn btn-dark mt-3' onClick={clearCart}>
											<FontAwesomeIcon icon={faTrashAlt} /> Limpiar Carrito
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};
