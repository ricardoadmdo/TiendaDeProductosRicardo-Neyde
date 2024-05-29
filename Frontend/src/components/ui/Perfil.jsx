import { useContext, useState } from 'react';
import { AuthContext } from '../../auth/authContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { types } from '../../types/types';
import Axios from 'axios';
import Swal from 'sweetalert2';

export const Perfil = () => {
	const { user, dispatch } = useContext(AuthContext);
	const [editMode, setEditMode] = useState(false);
	const [newName, setNewName] = useState(user.nombre);

	const handleSaveChanges = async (id, nombre) => {
		try {
			const response = await Axios.put(`http://localhost:3001/api/users/change/${id}`, {
				nombre,
			});

			const data = response.data.usuario;
			if (response.data.ok) {
				const action = {
					type: types.login,
					payload: {
						nombre: data.nombre,
						rol: data.rol,
						correo: data.correo,
						uid: data.uid,
					},
				};
				dispatch(action); // Actualizar el usuario en el contexto
				Swal.fire({
					title: 'Cambio Satisfactorio',
					text: 'Nombre cambiado correctamente',
					icon: 'success',
				});
			} else {
				console.error('Error Por favor contacta al admin');
			}
		} catch (error) {
			console.error('Error al cambiar el nombre:', error);
		}
		setEditMode(false);
	};

	const handleCancel = () => {
		setEditMode(false);
	};

	return (
		<div className='container my-4 animate__animated animate__fadeIn' style={{ maxWidth: '500px' }}>
			<div className='card mx-auto' style={{ minHeight: '450px' }}>
				<div className='card-header text-center bg-dark text-white'>
					<FontAwesomeIcon icon={faUserCircle} size='4x' />
					<h2 className='h4'>
						<strong>{user.nombre}</strong>
					</h2>
				</div>
				<div className='card-body'>
					{editMode ? (
						<div>
							<input type='text' className='form-control mb-2' value={newName} onChange={(e) => setNewName(e.target.value)} />
							<div className='d-flex justify-content-between'>
								<button className='btn btn-success' onClick={() => handleSaveChanges(user.uid, newName)}>
									Guardar cambios
								</button>
								<button className='btn btn-danger' onClick={handleCancel}>
									Cancelar
								</button>
							</div>
						</div>
					) : (
						<div>
							<p className='card-text'>
								<strong>Nombre: </strong>
								{user.nombre}
							</p>
							{user.rol !== 'USER_ROLE' && (
								<p className='card-text'>
									<strong>Rol:</strong> {user.rol}
								</p>
							)}
							<p className='card-text'>
								<strong>Correo Electrónico: </strong>
								{user.correo}
							</p>

							<button className='btn btn-info w-100' onClick={() => setEditMode(true)}>
								Cambiar nombre de usuario
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
