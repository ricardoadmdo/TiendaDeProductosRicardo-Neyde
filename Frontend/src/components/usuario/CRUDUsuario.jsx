import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import TablaCRUD from '../reutilizable-tablaCrud/TablaCRUD.jsx';
import { AuthContext } from '../../auth/authContext.jsx';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';
import { useNavigate } from 'react-router-dom';

export const CRUDUsuario = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		password: '',
		correo: '',
		rol: 'USER_ROLE', // Valor predeterminado para el rol,
		estado: true, //Predeterminado como activo
	});
	const navigate = useNavigate();
	const [operationMode, setOperationMode] = useState(1);
	const [usuariosList, setUsuarios] = useState([]);
	const [title, setTitle] = useState('');
	const { user } = useContext(AuthContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/buscarusuarios?query=${searchTerm}`);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			getUsuarios(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			getUsuarios(currentPage + 1);
		}
	};

	const limpiarCampos = () => {
		setFormState({
			nombre: '',
			password: '',
			correo: '',
			rol: 'USER_ROLE',
			estado: false,
		});
	};

	const add = () => {
		Axios.post('http://localhost:3001/api/users', formState)
			.then(() => {
				getUsuarios();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Registro exitoso!!!</strong>',
					html: '<i>El usuario <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch((error) => {
				const errorMessage =
					error.response && error.response.data && error.response.data.error
						? error.response.data.error
						: 'Error desconocido al agregar un usuario';
				Swal.fire({
					icon: 'error',
					title: 'Error al agregar un usuario',
					text: errorMessage,
				});
			});
	};

	const update = () => {
		// eslint-disable-next-line no-unused-vars
		const { password, ...dataToUpdate } = formState; // Destructura para excluir la contraseña
		Axios.put(`http://localhost:3001/api/users/${id}`, dataToUpdate)
			.then(() => {
				getUsuarios();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Actualización exitosa!!!</strong>',
					html: '<i>El usuario <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: error.response.data.msg,
				});
			});
	};

	const deleteUser = (val) => {
		Swal.fire({
			title: 'Confirmar eliminado?',
			html: '<i>Realmente desea eliminar a <strong>' + val.nombre + '</strong>?</i>',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminarlo!',
		})
			.then((result) => {
				if (result.isConfirmed) {
					Axios.delete(`http://localhost:3001/api/users/${val.uid}`, {
						headers: {
							'x-token': user.token,
						},
					}).then(() => {
						getUsuarios();
						limpiarCampos();
						Swal.fire({
							icon: 'success',
							title: val.nombre + ' fue eliminado.',
							showConfirmButton: false,
							timer: 2000,
						});
					});
				}
			})
			.catch(function (error) {
				console.log(error);
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: error.response.data.msg,
				});
			});
	};

	useEffect(() => {
		getUsuarios();
	}, []);

	const getUsuarios = () => {
		Axios.get('http://localhost:3001/api/users')
			.then((response) => {
				const { usuarios, totalPages, page } = response.data;
				setUsuarios(usuarios);
				setTotalPages(totalPages); // Actualizar el total de páginas
				setCurrentPage(page); // Actualizar la página actual
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const validar = (event) => {
		event.preventDefault();
		const { nombre, correo, password, rol } = formState;

		// Verifica que los campos 'nombre', 'correo' y 'rol' no estén vacíos
		if (nombre.trim() === '' || correo.trim() === '' || rol.trim() === '') {
			Swal.fire({
				icon: 'error',
				title: 'Campos Vacíos',
				text: 'Todos los campos son obligatorios',
			});
			return; // Detiene la ejecución si hay campos vacíos
		}

		// Si estamos en modo de creación, verifica la contraseña
		if (operationMode === 1) {
			if (!password || password.length < 6) {
				Swal.fire({
					icon: 'error',
					title: 'Contraseña no válida',
					text: 'La contraseña tiene que tener 6 o más caracteres',
				});
				return; // Detiene la ejecución si la contraseña no es válida
			}
			add(); // Llama a la función para agregar un nuevo usuario
		} else if (operationMode === 2) {
			update(); // Llama a la función para actualizar un usuario existente
		}

		document.getElementById('btnCerrar').click();
		getUsuarios();
	};

	const openModal = (op, usuario) => {
		// Reinicia el estado del formulario para un nuevo usuario o carga los datos para editar
		setFormState({
			nombre: op === 2 ? usuario.nombre : '',
			password: '', // La contraseña siempre debe estar vacía al abrir el modal
			correo: op === 2 ? usuario.correo : '',
			rol: op === 2 ? usuario.rol : 'USER_ROLE', // Valor predeterminado para el rol
			estado: op === 2 ? usuario.estado : false,
		});

		// Establece el modo de operación y el título del modal
		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Usuario' : 'Editar Usuario');

		// Si es modo de edición, establece el ID
		if (op === 2) {
			setId(usuario.uid);
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
				searchTerm={searchTerm}
				handleSearchChange={handleSearchChange}
				handleSearchSubmit={handleSearchSubmit}
				busqueda={true}
				data={usuariosList}
				onAdd={() => openModal(1)}
				columns={[
					{ header: 'ID', accessor: 'uid' },
					{ header: 'Nombre', accessor: 'nombre' },
					{ header: 'Correo Electrónico', accessor: 'correo' },
					{ header: 'Rol', accessor: 'rol' },
					{ header: 'Estado en DB', accessor: 'estado' },
				]}
				onEdit={(usuario) => openModal(2, usuario)}
				onDelete={deleteUser}
				title={title}
				modalTitle='Añadir nuevo Usuario'
				validate={validar}
				operationMode={operationMode}
				setOperationMode={setOperationMode}
				formFields={[
					{ name: 'nombre', label: 'Nombre', placeholder: 'Ingrese un nombre', type: 'text' },
					{ name: 'password', label: 'Contraseña', placeholder: 'Ingrese una contraseña', type: 'password' },
					{ name: 'correo', label: 'Correo Electrónico', placeholder: 'Ingrese un correo electrónico', type: 'email' },
					{
						name: 'estado',
						label: 'Estado en Base de Datos',
						type: 'select',
						options: [
							{ value: true, label: 'Activo' },
							{ value: false, label: 'Inactivo' },
						],
					},
					{
						name: 'rol',
						label: 'Rol',
						type: 'select',
						options: [
							{ value: 'USER_ROLE', label: 'USER_ROLE' },
							{ value: 'ADMIN_ROLE', label: 'ADMIN_ROLE' },
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
