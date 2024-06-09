import { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import TablaCRUD from '../reutilizable-tablaCrud/TablaCRUD.jsx';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';

const fetchProductos = async ({ queryKey }) => {
	const [, page, limit] = queryKey;
	const response = await Axios.get(`http://localhost:3001/api/product?page=${page}&limit=${limit}`);
	return response.data;
};

const CRUDProducto = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		cantidad: '',
		precio: '',
		url: '',
	});
	const [operationMode, setOperationMode] = useState(1);
	const [title, setTitle] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	const queryClient = useQueryClient();
	const refetchProductos = () => {
		queryClient.invalidateQueries(['combos']);
	};

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
		return <LoadingSpinner />;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const productosList = productosData?.productos || [];
	const totalPages = productosData?.totalPages || 0;

	const limpiarCampos = () => {
		setFormState({
			nombre: '',
			cantidad: '',
			precio: '',
			url: '',
		});
	};

	const addProductos = () => {
		Axios.post('http://localhost:3001/api/product', formState)
			.then(() => {
				refetchProductos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Registro exitoso!!!</strong>',
					html: '<i>El producto <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text:
						JSON.parse(JSON.stringify(error)).message === 'Network Error'
							? 'Intente mas tarde'
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	const updateProductos = () => {
		Axios.put(`http://localhost:3001/api/product/${id}`, formState)
			.then(() => {
				refetchProductos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Actualización exitoso!!!</strong>',
					html: '<i>El producto <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text:
						JSON.parse(JSON.stringify(error)).message === 'Network Error'
							? 'Intente mas tarde'
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	const deleteProductos = (val) => {
		Swal.fire({
			title: 'Confirmar eliminado?',
			html: '<i>Realmente desea eliminar a <strong>' + val.nombre + '</strong>?</i>',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminarlo!',
		}).then((result) => {
			if (result.isConfirmed) {
				Axios.delete(`http://localhost:3001/api/product/${val.uid}`)
					.then(() => {
						refetchProductos();
						limpiarCampos();
						Swal.fire({
							icon: 'success',
							title: 'El producto ' + val.nombre + ' fue eliminado.',
							showConfirmButton: false,
							timer: 2000,
						});
					})
					.catch(function (error) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No se logro eliminar el producto!',
							footer:
								JSON.parse(JSON.stringify(error)).message === 'Network Error'
									? 'Intente mas tarde'
									: JSON.parse(JSON.stringify(error)).message,
						});
					});
			}
		});
	};

	const validar = (event) => {
		event.preventDefault();
		const { nombre, cantidad, precio, url } = formState;
		if (nombre.trim() === '' || cantidad === 0 || precio === 0 || url.trim() === '') {
			Swal.fire({
				icon: 'error',
				title: 'Campos Vacíos',
				text: 'Todos los campos son obligatorios',
			});
		} else {
			if (operationMode === 1) {
				addProductos();
			}

			if (operationMode === 2) {
				updateProductos();
			}

			document.getElementById('btnCerrar').click();
			refetchProductos();
		}
	};

	const openModal = (op, producto) => {
		setFormState({
			nombre: op === 2 ? producto.nombre : '',
			cantidad: op === 2 ? producto.cantidad : '',
			precio: op === 2 ? producto.precio : '',
			url: op === 2 ? producto.url : '',
		});
		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Producto' : 'Editar Producto');

		// Si es modo de edición, establece el ID
		if (op === 2) {
			setId(producto.uid);
		} else {
			setId('');
		}

		// Enfoca el primer campo del formulario después de un breve retraso
		window.setTimeout(() => {
			document.getElementById('nombre').focus();
		}, 500);
	};

	return (
		<>
			<TablaCRUD
				busqueda={false}
				data={productosList}
				onAdd={() => openModal(1)}
				columns={[
					{ header: 'ID', accessor: 'uid' },
					{ header: 'Nombre', accessor: 'nombre' },
					{ header: 'Cantidad', accessor: 'cantidad' },
					{ header: 'Precio', accessor: 'precio' },
				]}
				onEdit={(usuario) => openModal(2, usuario)}
				onDelete={deleteProductos}
				title={title}
				modalTitle='Añadir nuevo Producto'
				validate={validar}
				operationMode={operationMode}
				setOperationMode={setOperationMode}
				formFields={[
					{ name: 'nombre', label: 'Nombre', placeholder: 'Ingrese un nombre', type: 'text' },
					{ name: 'cantidad', label: 'Cantidad', placeholder: 'Ingrese la cantidad', type: 'number' },
					{ name: 'precio', label: 'Precio', placeholder: 'Ingrese un precio', type: 'number' },
					{ name: 'url', label: 'Url', placeholder: 'Ingrese una url', type: 'text' },
				]}
				formState={formState}
				setFormState={setFormState}
			/>
			<Pagination currentPage={currentPage} totalPages={totalPages} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} />
		</>
	);
};

export default CRUDProducto;
