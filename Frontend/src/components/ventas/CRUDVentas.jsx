import { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const fetchProductos = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/product?page=${page}&search=${searchTerm}`);
	return response.data;
};

const CRUDVentas = () => {
	const [formState, setFormState] = useState({
		productos: [],
		totalProductos: 0,
		precioTotal: 0,
		fecha: new Date(),
	});
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
			const productoExistente = prevState.productos.find((p) => p.uid === producto.uid);
			let nuevosProductos;

			if (productoExistente) {
				nuevosProductos = prevState.productos.map((p) => (p.uid === producto.uid ? { ...p, cantidad: p.cantidad + cantidad } : p));
			} else {
				nuevosProductos = [...prevState.productos, { ...producto, cantidad }];
			}

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
		<div className='container mt-4 my-5'>
			<h2 className='mb-4'>Registrar Venta</h2>
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
									Agregar a la venta
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
			<h4>Venta Actual</h4>
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
								Eliminar
							</button>
							<button className='btn btn-primary me-2' onClick={() => disminuirCantidad(producto.uid)}>
								-
							</button>
							<button className='btn btn-primary' onClick={() => aumentarCantidad(producto.uid)}>
								+
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
