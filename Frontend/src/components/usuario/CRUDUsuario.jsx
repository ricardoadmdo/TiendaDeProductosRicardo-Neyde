import { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import TablaCRUD from '../reutilizable-tablaCrud/TablaCRUD.jsx';
import { AuthContext } from '../../auth/authContext.jsx';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const fetchUsuarios = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/users?page=${page}&search=${searchTerm}`);
	return response.data;
};

export const CRUDUsuario = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		password: '',
		correo: '',
		rol: 'USER_ROLE',
		estado: true,
	});
	const navigate = useNavigate();
	const [operationMode, setOperationMode] = useState(1);
	const { user } = useContext(AuthContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [title, setTitle] = useState('');

	const queryClient = useQueryClient();
	const refetchUsuarios = () => {
		queryClient.invalidateQueries(['usuarios']);
	};

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['usuarios', { page: currentPage, searchTerm: debouncedSearchTerm }],
		queryFn: () => fetchUsuarios({ page: currentPage, searchTerm: debouncedSearchTerm }),
		keepPreviousData: true,
	});

	const mutation = useMutation({
		mutationFn: (newUser) => Axios.post('http://localhost:3001/api/users', newUser),
		onSuccess: () => {
			refetchUsuarios();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Registro exitoso!!!</strong>',
				html: '<i>El usuario <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al agregar un usuario',
				text: error.response?.data?.error || 'Error desconocido al agregar un usuario',
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => Axios.put(`http://localhost:3001/api/users/${id}`, data),
		onSuccess: () => {
			refetchUsuarios();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Actualización exitosa!!!</strong>',
				html: '<i>El usuario <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.response?.data?.msg || 'Error desconocido al actualizar el usuario',
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (uid) =>
			Axios.delete(`http://localhost:3001/api/users/${uid}`, {
				headers: { 'x-token': user.token },
			}),
		onSuccess: () => {
			refetchUsuarios();
			limpiarCampos();
			Swal.fire({
				icon: 'success',
				title: 'Usuario eliminado.',
				showConfirmButton: false,
				timer: 2000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.response?.data?.msg || 'Error desconocido al eliminar el usuario',
			});
		},
	});

	const handleSearchChange = (e) => setSearchTerm(e.target.value);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/dashboard/buscarusuarios?query=${searchTerm}`);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	const limpiarCampos = () => setFormState({ nombre: '', password: '', correo: '', rol: 'USER_ROLE', estado: false });

	// Debounce logic
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 4000); // 4 segundos de retraso
		return () => {
			clearTimeout(timerId); // Limpiar el temporizador en cada cambio de término de búsqueda
		};
	}, [searchTerm]);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const validar = (event) => {
		event.preventDefault();
		const { nombre, correo, password, rol } = formState;
		if (nombre.trim() === '' || correo.trim() === '' || rol.trim() === '') {
			Swal.fire({ icon: 'error', title: 'Campos Vacíos', text: 'Todos los campos son obligatorios' });
			return;
		}
		if (operationMode === 1 && (!password || password.length < 6)) {
			Swal.fire({ icon: 'error', title: 'Contraseña no válida', text: 'La contraseña tiene que tener 6 o más caracteres' });
			return;
		}
		if (operationMode === 1) {
			mutation.mutate(formState);
		} else if (operationMode === 2) {
			updateMutation.mutate({ id, data: { ...formState, password: undefined } });
		}
		document.getElementById('btnCerrar').click();
	};

	const openModal = (op, usuario) => {
		setFormState({
			nombre: op === 2 ? usuario.nombre : '',
			password: '',
			correo: op === 2 ? usuario.correo : '',
			rol: op === 2 ? usuario.rol : 'USER_ROLE',
			estado: op === 2 ? usuario.estado : false,
		});
		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Usuario' : 'Editar Usuario');
		if (op === 2) setId(usuario.uid);
		window.setTimeout(() => document.getElementById('nombre').focus(), 500);
	};

	return (
		<>
			<TablaCRUD
				searchTerm={searchTerm}
				handleSearchChange={handleSearchChange}
				handleSearchSubmit={handleSearchSubmit}
				busqueda={true}
				data={data?.usuarios || []}
				onAdd={() => openModal(1)}
				columns={[
					{ header: 'ID', accessor: 'uid' },
					{ header: 'Nombre', accessor: 'nombre' },
					{ header: 'Correo Electrónico', accessor: 'correo' },
					{ header: 'Rol', accessor: 'rol' },
					{ header: 'Estado en DB', accessor: 'estado' },
				]}
				onEdit={(usuario) => openModal(2, usuario)}
				onDelete={(usuario) => deleteMutation.mutate(usuario.uid)}
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
			<Pagination
				currentPage={currentPage}
				totalPages={data?.totalPages || 0}
				handlePreviousPage={handlePreviousPage}
				handleNextPage={handleNextPage}
			/>
		</>
	);
};
