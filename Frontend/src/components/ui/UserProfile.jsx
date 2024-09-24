import { useContext, useState } from 'react';
import { AuthContext } from '../../auth/authContext';
import Swal from 'sweetalert2';
import Axios from 'axios';

const UserProfile = () => {
	const { user } = useContext(AuthContext);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handlePasswordChange = async(e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Las contraseñas no coinciden',
			});
		} else {
			
			const response = await Axios.post('http://localhost:3001/api/auth/google', {
				newPassword
			});

			Swal.fire({
				icon: 'success',
				title: 'Éxito',
				text: 'Contraseña actualizada',
			});
		}
	};

	return (
		<div className='container mt-5'>
			<div className='card shadow-sm p-3 mb-5 bg-white rounded'>
				<div className='row'>
					<div className='col-md-4 text-center'>
						<img src='https://via.placeholder.com/150' alt='User Avatar' className='rounded-circle img-fluid' />
						<h4 className='mt-3'>{user.nombre}</h4>
						<p className='text-muted'>{user.correo}</p>
					</div>
					<div className='col-md-8'>
						<div className='card-body'>
							<h5 className='card-title'>Información Personal</h5>
							<div className='row mb-3'>
								<div className='col'>
									<p>
										<strong>Nombre: </strong>
										{user.nombre}
									</p>
									<p>
										<strong>Correo: </strong>
										{user.correo}
									</p>
									<p>
										<strong>Rol: </strong>
										{user.rol}
									</p>
								</div>
							</div>
							{!showChangePassword && (
								<button className='btn btn-primary' onClick={() => setShowChangePassword(true)}>
									Cambiar Contraseña
								</button>
							)}

							{showChangePassword && (
								<form className='mt-4' onSubmit={handlePasswordChange}>
									<div className='form-group'>
										<label htmlFor='formCurrentPassword'>Contraseña Actual</label>
										<input
											type='password'
											className='form-control'
											id='formCurrentPassword'
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											required
										/>
									</div>
									<div className='form-group mt-3'>
										<label htmlFor='formNewPassword'>Nueva Contraseña</label>
										<input
											type='password'
											className='form-control'
											id='formNewPassword'
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											required
										/>
									</div>
									<div className='form-group mt-3'>
										<label htmlFor='formConfirmPassword'>Confirmar Contraseña</label>
										<input
											type='password'
											className='form-control'
											id='formConfirmPassword'
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
										/>
									</div>
									<div className='d-flex justify-content-between mt-3'>
										<button className='btn btn-danger' type='button' onClick={() => setShowChangePassword(false)}>
											Cancelar
										</button>
										<button className='btn btn-success' type='submit'>
											Actualizar Contraseña
										</button>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
