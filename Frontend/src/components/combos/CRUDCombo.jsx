import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import TablaCRUD from '../reutilizable-tablaCrud/TablaCRUD.jsx';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';

export const CRUDCombo = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		precio: '',
		description: '',
		url: '',
		cantidad: '',
		estado: true, //Predeterminado como activo
	});
	const [operationMode, setOperationMode] = useState(1);
	const [combosList, setCombos] = useState([]);
	const [title, setTitle] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

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

	const limpiarCampos = () => {
		setFormState({
			nombre: '',
			description: '',
			precio: '',
			url: '',
			cantidad: '',
			estado: false,
		});
	};

	const addCombos = () => {
		Axios.post('http://localhost:3001/api/combo', formState)
			.then(() => {
				getCombos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Registro exitoso!!!</strong>',
					html: '<i>El combo <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
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

	const updateCombos = () => {
		Axios.put(`http://localhost:3001/api/combo/${id}`, formState)
			.then(() => {
				getCombos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Actualización exitoso!!!</strong>',
					html: '<i>El combo <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
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

	const deleteCombos = (val) => {
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
				Axios.delete(`http://localhost:3001/api/combo/${val.uid}`)
					.then(() => {
						getCombos();
						limpiarCampos();
						Swal.fire({
							icon: 'success',
							title: 'El combo ' + val.nombre + ' fue eliminado.',
							showConfirmButton: false,
							timer: 2000,
						});
					})
					.catch(function (error) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No se logro eliminar el combo!',
							footer:
								JSON.parse(JSON.stringify(error)).message === 'Network Error'
									? 'Intente mas tarde'
									: JSON.parse(JSON.stringify(error)).message,
						});
					});
			}
		});
	};

	useEffect(() => {
		getCombos();
	}, []);

	const getCombos = () => {
		Axios.get('http://localhost:3001/api/combo')
			.then((response) => {
				const { combos, totalPages, page } = response.data;
				setCombos(combos);
				setTotalPages(totalPages); // Actualizar el total de páginas
				setCurrentPage(page);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const validar = (event) => {
		event.preventDefault();
		const { nombre, description, precio, url, cantidad } = formState;
		if (nombre.trim() === '' || description.trim() === '' || precio === 0 || url.trim() === '' || cantidad === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Campos Vacíos',
				text: 'Todos los campos son obligatorios',
			});
		} else {
			if (operationMode === 1) {
				addCombos();
			}

			if (operationMode === 2) {
				updateCombos();
			}

			document.getElementById('btnCerrar').click();
			getCombos();
		}
	};

	const openModal = (op, combo) => {
		setFormState({
			nombre: op === 2 ? combo.nombre : '',
			cantidad: op === 2 ? combo.cantidad : '',
			description: op === 2 ? combo.description : '',
			precio: op === 2 ? combo.precio : '',
			url: op === 2 ? combo.url : '',
			estado: op === 2 ? combo.estado : false,
		});

		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Combo' : 'Editar Combo');

		// Si es modo de edición, establece el ID
		setId(op === 2 ? combo.uid : '');

		// Enfoca el primer campo del formulario después de un breve retraso
		window.setTimeout(() => {
			document.getElementById('nombre').focus();
		}, 500);
	};

	return (
		<>
			<TablaCRUD
				busqueda={false}
				data={combosList}
				onAdd={() => openModal(1)}
				columns={[
					{ header: 'ID', accessor: 'uid' },
					{ header: 'Nombre', accessor: 'nombre' },
					{ header: 'Cantidad', accessor: 'cantidad' },
					{ header: 'Precio', accessor: 'precio' },
					{ header: 'Descripción', accessor: 'description' },
					{ header: 'Url', accessor: 'url' },
					{ header: 'Estado en DB', accessor: 'estado' },
				]}
				onEdit={(combo) => openModal(2, combo)}
				onDelete={deleteCombos}
				title={title}
				modalTitle='Añadir nuevo Combo'
				validate={validar}
				operationMode={operationMode}
				setOperationMode={setOperationMode}
				formFields={[
					{ name: 'nombre', label: 'Nombre', placeholder: 'Ingrese un nombre', type: 'text' },
					{ name: 'cantidad', label: 'Cantidad', placeholder: 'Ingrese la cantidad', type: 'number' },
					{ name: 'description', label: 'Descripción', placeholder: 'Ingrese una descripción', type: 'text' },
					{ name: 'precio', label: 'Precio', placeholder: 'Ingrese un precio', type: 'number' },
					{ name: 'url', label: 'Url', placeholder: 'Ingrese una url', type: 'text' },
					{
						name: 'estado',
						label: 'Estado en Base de Datos',
						type: 'select',
						options: [
							{ value: true, label: 'Activo' },
							{ value: false, label: 'Inactivo' },
						],
					},
				]}
				formState={formState}
				setFormState={setFormState}
			/>
			<Pagination currentPage={currentPage} totalPages={totalPages} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} />
		</>
	);
};
