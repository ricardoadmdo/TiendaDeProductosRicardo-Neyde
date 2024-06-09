import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const fetchProductos = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/product?page=${page}&search=${searchTerm}`);
	return response.data;
};

const CRUDVentas = () => {
	const [formState, setFormState] = useState(() => {
		const savedFormState = localStorage.getItem('formState');

		return savedFormState
			? JSON.parse(savedFormState)
			: {
					productos: [],
					totalProductos: 0,
					precioTotal: 0,
					fecha: new Date(),
			  };
	});

	useEffect(() => {
		localStorage.setItem('formState', JSON.stringify(formState));
	}, [formState]);

	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

	const queryClient = useQueryClient();
	const refetchProductos = () => {
		queryClient.invalidateQueries(['productos']);
	};

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['productos', { page: currentPage, searchTerm: debouncedSearchTerm }],
		queryFn: () => fetchProductos({ page: currentPage, searchTerm: debouncedSearchTerm }),
		keepPreviousData: true,
	});

	const ventaMutation = useMutation({
		mutationFn: (newVenta) => Axios.post('http://localhost:3001/api/venta', newVenta),
		onSuccess: () => {
			refetchProductos();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Venta registrada con éxito!</strong>',
				html: '<i>La venta fue registrada exitosamente</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al registrar la venta',
				text: error.response?.data?.error || 'Error desconocido al registrar la venta',
			});
		},
	});

	const handleSearchChange = (e) => setSearchTerm(e.target.value);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setDebouncedSearchTerm(searchTerm);
		setCurrentPage(1);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	const limpiarCampos = () => setFormState({ productos: [], totalProductos: 0, precioTotal: 0, fecha: new Date() });

	const openModal = (producto) => {
		Swal.fire({
			title: 'Ingrese la cantidad',
			input: 'number',
			inputAttributes: {
				min: 1,
				autocapitalize: 'off',
			},
			inputValue: '1',
			showCancelButton: true,
			confirmButtonText: 'Agregar',
			showLoaderOnConfirm: true,
			preConfirm: (cantidad) => {
				if (!cantidad || cantidad < 1) {
					Swal.showValidationMessage('Debe ingresar una cantidad válida');
					return false;
				}
				agregarProducto(producto, parseInt(cantidad));
			},
			allowOutsideClick: () => !Swal.isLoading(),
		});
	};

	const agregarProducto = (producto, cantidad) => {
		setFormState((prevState) => {
			// Hacer una copia del array de productos
			const nuevosProductos = [...prevState.productos];

			// Buscar si el producto ya está en la lista
			const index = nuevosProductos.findIndex((p) => p.uid === producto.uid);

			if (index !== -1) {
				// Si el producto ya existe, actualizar su cantidad
				nuevosProductos[index].cantidad += cantidad;
			} else {
				// Si el producto no existe, agregarlo al array
				nuevosProductos.push({ ...producto, cantidad });
			}

			// Calcular el total de productos y el precio total
			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			// Devolver el nuevo estado
			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const eliminarProducto = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.filter((p) => p.uid !== productoId);
			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const aumentarCantidad = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.map((p) => (p.uid === productoId ? { ...p, cantidad: p.cantidad + 1 } : p));

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const disminuirCantidad = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.map((p) => (p.uid === productoId ? { ...p, cantidad: p.cantidad - 1 } : p));

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const validar = (event) => {
		event.preventDefault();
		const { productos } = formState;
		if (productos.length === 0) {
			Swal.fire({ icon: 'error', title: 'No hay productos', text: 'Debe agregar al menos un producto a la venta' });
			return;
		}
		ventaMutation.mutate(formState);
	};

	return (
		<div className='container mt-4 my-5 animate__animated animate__fadeIn'>
			<h2 className='text-center mb-4'>Registrar Ventas</h2>
			<h3 className='text-center mb-4'>Día de Hoy: {new Date().toLocaleDateString()}</h3>
			<form onSubmit={handleSearchSubmit} className='mb-4'>
				<div className='input-group'>
					<input type='text' className='form-control' placeholder='Buscar producto' value={searchTerm} onChange={handleSearchChange} />
					<button className='btn btn-primary' type='submit'>
						Buscar
					</button>
				</div>
			</form>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<div className='alert alert-danger'>Error: {error.message}</div>
			) : (
				<>
					<div className='list-group mb-4'>
						{data?.productos.map((producto) => (
							<div key={producto.uid} className='list-group-item d-flex justify-content-between align-items-center'>
								<div>
									<h5 className='mb-1'>{producto.nombre}</h5>
									<p className='mb-1'>Precio: ${producto.precio}</p>
								</div>
								<button className='btn btn-success' onClick={() => openModal(producto)}>
									Agregar{' '}
									<svg xmlns='http://www.w3.org/2000/svg' width='25px' height='25px' viewBox='0 0 24 24'>
										<path
											fill='currentColor'
											d='M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4zm1 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
					<Pagination
						currentPage={currentPage}
						totalPages={data?.totalPages || 0}
						handlePreviousPage={handlePreviousPage}
						handleNextPage={handleNextPage}
					/>
				</>
			)}
			<hr />
			<h4>Detalles de la Venta</h4>
			<ul className='list-group mb-4'>
				{formState.productos.map((producto) => (
					<li key={producto.uid} className='list-group-item d-flex justify-content-between align-items-center'>
						<div>
							<h5 className='mb-1'>{producto.nombre}</h5>
							<p className='mb-1'>Cantidad: {producto.cantidad}</p>
							<p className='mb-1'>Precio Total: ${producto.precio * producto.cantidad}</p>
						</div>
						<div>
							<button className='btn btn-danger me-2' onClick={() => eliminarProducto(producto.uid)}>
								<FontAwesomeIcon icon={faTrashAlt} />
							</button>
							<button
								className='btn btn-secondary me-2'
								onClick={() => disminuirCantidad(producto.uid)}
								disabled={producto.cantidad <= 1}
							>
								<FontAwesomeIcon icon={faMinus} />
							</button>
							<button className='btn btn-secondary' onClick={() => aumentarCantidad(producto.uid)}>
								<FontAwesomeIcon icon={faPlus} />
							</button>
						</div>
					</li>
				))}
			</ul>
			<div className='d-flex justify-content-between align-items-center'>
				<h5>Total Productos: {formState.totalProductos}</h5>
				<h5>Precio Total: ${formState.precioTotal}</h5>
			</div>
			<button className='btn btn-primary mt-3' onClick={validar}>
				Registrar Venta
			</button>
		</div>
	);
};

export default CRUDVentas;
