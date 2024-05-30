import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { AuthContext } from '../../auth/authContext';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from 'axios';

export const Carrito = () => {
	const municipiosRepartos = {
		'Habana Vieja': ['Prado', 'Santo Ángel', 'Catedral', 'Plaza Vieja', 'Belén', 'Jesús María', 'San Isidro', 'Tallapiedra'],
		'Centro Habana': ['Cayo Hueso', 'Dragones', 'Colón', 'Pueblo Nuevo', 'Los Sitios', 'Barrio Chino'],
		'Cerro': ['Casino Deportivo', 'Martí', 'Palatino', 'Santa Catalina', 'Villanueva', 'Ayestarán', 'Pilar', 'Atares'],
		'10 de Octubre': ['A ambos lados de la calzada de 10 de octubre', 'antigua Jesús del Monte'],
		'Plaza': ['Vedado', 'Miramar', 'Siboney', 'Alturas de Almendares', 'Kohly'],
		'Arroyo Naranjo': ['Los Pinos', 'Mantilla', 'Calabazar', 'Wajay', 'Santiago de las Vegas', 'Eléctrico'],
		'Boyeros': ['Alamar', 'Santiago de las Vegas', 'Eléctrico', 'Calabazar', 'Wajay', 'Las Cañas'],
		'Cotorro': ['Santa María del Rosario', 'Güira de Melena', 'Jaruco', 'Madruga', 'San José de las Lajas'],
		'San Miguel del Padrón': [
			'Camilo Cienfuegos',
			'Diezmero',
			'Eléctrico',
			'Guanabacoa',
			'La Ceiba',
			'Luyanó Moderno',
			'Luyanó',
			'Mariano',
			'Párraga',
			'Pogolotti',
			'Sevillano',
			'Víbora Park',
			'Zamora',
		],
		'Playa': ['Miramar', 'Siboney', 'Flores', 'La Sierra', 'Santa Fe', 'Cubanacán', 'Kohly', 'Náutico', 'Nuevo Vedado', 'Almendares'],
		'Marianao': [
			'La Lisa',
			'Pogolotti',
			'Sevillano',
			'Luyanó Moderno',
			'Luyanó',
			'Mariano',
			'Párraga',
			'Víbora Park',
			'Zamora',
			'Cubanacán',
			'Kohly',
			'Náutico',
			'Nuevo Vedado',
			'Almendares',
		],
		'La Lisa': [
			'Punta Brava',
			'La Palma',
			'La Ceiba',
			'La Fortuna',
			'San Agustín',
			'San Pedro',
			'Santa Felicia',
			'Santa Fe',
			'Santa Teresa',
			'San Antonio',
			'San José',
			'San Miguel',
			'San Nicolás',
			'San Pedro',
			'San Rafael',
			'San Ramón',
			'San Ricardo',
			'San Roque',
			'San Vicente',
			'Santa Ana',
			'Santa Bárbara',
			'Santa Clara',
			'Santa Cruz',
			'Santa Emilia',
			'Santa Isabel',
			'Santa Lucía',
			'Santa María',
			'Santa Marta',
			'Santa Rosa',
			'Santa Teresa',
			'Santa Teresita',
		],
	};

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
			await Axios.post('http://localhost:3001/api/pago/create-checkout-session', { cartItems: cart })
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
			<div className='row animate__animated animate__fadeIn '>
				<div className='col-md-8 offset-md-2'>
					<div className='my-2 align-items-center'>
						<p className='m-0'>
							<strong>Valor Total de la Compra </strong> 🛒: {total} USD
						</p>
						<button type='button' className='btn btn-danger ' onClick={clearCart}>
							Limpiar Carrito
						</button>
					</div>
				</div>
			</div>

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
											<p className='card-text'>
												<strong>Precio:</strong> {val.precio} USD
											</p>
											<p className='card-text'>
												<strong>Cantidad a comprar:</strong> {val.cantidadAdd}
											</p>
											<p className='card-text'>
												<strong>Subtotal:</strong> {val.precio * val.cantidadAdd} USD
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
														Quitar
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
								<select className='form-control' name='municipio' value={recipient.municipio} onChange={handleInputChange} required>
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
											<p>
												<strong>Identificación del vendedor:</strong>
												<br />
												Somos Ricardo & Neyde, con domicilio a toda La Habana.
												<br />
												<br />
												<strong>Características y precio de los productos:</strong>
												<br />
												Ofrecemos productos de las siguientes categorías: Cafetería y Combos. Cada producto tiene una ficha
												detallada que incluye su nombre, descripción, imagen, precio, y disponibilidad. El precio de los
												productos se expresa en USD. El vendedor se reserva el derecho de modificar los precios, los productos
												y las ofertas en cualquier momento y sin previo aviso.
												<br />
												<br />
												<strong>Métodos de pago:</strong>
												<br />
												El usuario podrá realizar el pago de su pedido de forma presencial y en dinero físico, en el momento
												de la recogida del producto. El usuario deberá presentar el comprobante de su pedido en la página web.
												El vendedor no acepta ningún otro método de pago, como tarjeta de crédito o transferencia, etc.
												<br />
												<br />
												<strong>Métodos y gastos de envío:</strong>
												<br />
												No nos hacemos responsable de los posibles retrasos o incidencias en la entrega causados por motivos
												ajenos a su voluntad, como huelgas, condiciones meteorológicas, etc.
												<br />
												<br />
												<strong>Política de devoluciones, cambios y garantías:</strong>
												<br />
												El usuario no tiene derecho a desistir de su compra ni a solicitar el cambio de un producto por otro,
												una vez que haya recogido el pedido en el establecimiento del vendedor. El usuario debe revisar
												detalladamente toda la mercancía que compra y asegurarse de que está conforme con su estado y calidad,
												antes de realizar el pago y salir del recinto del vendedor. El vendedor no se hace responsable de
												ningún defecto, daño o deterioro que el producto pueda sufrir después de su salida del recinto del
												vendedor. El vendedor ofrece una garantía de que el producto es nuevo y no ha sido usado ni manipulado
												por terceros. Esta garantía se limita al momento de la entrega del producto al usuario, y no cubre los
												defectos o faltas de conformidad que puedan surgir por el uso indebido, desgaste, rotura o
												manipulación por parte del usuario. El usuario renuncia expresamente a cualquier reclamación o acción
												legal contra el vendedor por los defectos o faltas de conformidad que el producto pueda presentar
												después de su salida del recinto del vendedor.
											</p>
										</div>

										<div className='modal-footer'>
											<button type='button' className='btn btn-secondary' data-dismiss='modal'>
												Cerrar
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className='d-flex justify-content-between'>
								{' '}
								<button type='button' className='btn btn-success' onClick={finalizeOrder}>
									Finalizar Pedido
								</button>
								<button type='button' className='btn btn-success' onClick={pagoOnline}>
									Pagar con Tarjeta
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};
