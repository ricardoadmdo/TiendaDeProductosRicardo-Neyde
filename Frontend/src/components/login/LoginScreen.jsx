import { useNavigate, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import Axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

export const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);

	//Nuevo usuario google
	const [newUser, setNewUser] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const login = useGoogleLogin({
		onSuccess: (codeResponse) => handleGoogleLogin(codeResponse),
		onError: (error) => console.log('Login Failed:', error),
	});

	const handleGoogleLogin = async (codeResponse) => {
		try {
			const response = await Axios.post('http://localhost:3001/api/auth/google', {
				access_token: codeResponse.access_token,
			});
			const userData = response.data.usuario;

			if (response.data.newUser) {
				setNewUser(true);
				setEmail(userData.correo);
				return;
			}

			const action = {
				type: types.login,
				payload: {
					nombre: userData.nombre,
					correo: userData.correo,
					token: response.data.token,
					rol: userData.rol,
					uid: userData.uid,
					google: true,
				},
			};
			dispatch(action);
			navigate('/');
		} catch (error) {
			console.error('Error durante la autenticación con Google:', error);
		}
	};

	const handleNewUserSubmit = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Las contraseñas no coinciden',
			});
			return;
		}

		try {
			const response = await Axios.post('http://localhost:3001/api/auth/create-password', {
				correo: email,
				password: newPassword,
			});

			const userData = response.data.usuario;
			const action = {
				type: types.login,
				payload: {
					nombre: userData.nombre,
					correo: userData.correo,
					token: response.data.token,
					rol: userData.rol,
					uid: userData.uid,
					google: true,
				},
			};
			dispatch(action);
			navigate('/');
		} catch (error) {
			console.error('Error during password creation:', error);
		}
	};

	const showErrorAlert = () => {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Usuario o contraseña incorrectos',
		});
	};

	const showConfirm = () => {
		Swal.fire({
			title: 'Bienvenido a la web de ventas de Ricardo & Neyde',
			text: 'Sesión iniciada correctamente',
			icon: 'success',
		});
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await Axios.post('http://localhost:3001/api/auth/login', {
				correo: email,
				password: password,
			});

			const data = response.data;
			if (data) {
				const action = {
					type: types.login,
					payload: {
						nombre: data.usuario.nombre,
						rol: data.usuario.rol,
						correo: data.usuario.correo,
						uid: data.usuario.uid,
						token: data.token,
					},
				};
				dispatch(action);

				const lastPath = localStorage.getItem('lastPath') || '/';
				navigate(lastPath, {
					replace: true,
				});
				showConfirm();
			} else {
				showErrorAlert();
			}
		} catch (error) {
			console.error('Error al iniciar sesión:', error);
			showErrorAlert();
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		} else if (name === 'newPassword') {
			setNewPassword(value);
		} else if (name === 'confirmPassword') {
			setConfirmPassword(value);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div
			className='container-fluid d-flex justify-content-center align-items-center vh-100'
			style={{
				backgroundImage: `url(https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/dtybbo5xcuw8m4ur1tib.jpg)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
				zIndex: '-1',
			}}
		>
			<div className='card p-4 shadow text-center' style={{ borderRadius: '24px', backgroundColor: 'rgba(250, 250, 250, 0.819)', zIndex: '2' }}>
				{newUser ? (
					<>
						<h3 className='mb-3'>Cree una contraseña para su cuenta: </h3>
						<form className='d-grid gap-3' onSubmit={handleNewUserSubmit}>
							<div className='form-group'>
								<label>Contraseña:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={newPassword}
									type='password'
									name='newPassword'
									placeholder='Contraseña'
									required
								/>
							</div>
							<div className='form-group'>
								<label>Confirmar Contraseña:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={confirmPassword}
									type='password'
									name='confirmPassword'
									placeholder='Confirmar Contraseña'
									required
								/>
							</div>
							<button className='btn btn-success' type='submit'>
								Crear Contraseña
							</button>
						</form>
					</>
				) : (
					<>
						<h3 className='mb-3'>Bienvenido Amigo!</h3>
						<h2 className='mb-4'>Inicia Sesión</h2>
						<form className='d-grid gap-3' onSubmit={handleLogin}>
							<div className='form-group'>
								<label>Su dirección de correo electrónico:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={email}
									type='email'
									name='email'
									placeholder='correo@.com'
									required
									autoComplete='off'
								/>
							</div>
							<div className='form-group position-relative'>
								<label>Contraseña:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={password}
									type={showPassword ? 'text' : 'password'}
									name='password'
									placeholder='Contraseña'
									autoComplete='off'
									required
								/>
								<FontAwesomeIcon
									className='position-absolute top-50 end-0 translate-middle-y me-3'
									icon={showPassword ? faEyeSlash : faEye}
									onClick={togglePasswordVisibility}
								/>
							</div>
							<button className='btn btn-success' type='submit'>
								Iniciar Sesión
							</button>
							<div className='mt-3'>
								<button className='btn btn-outline-dark d-flex align-items-center' onClick={login}>
									<img src='https://img.icons8.com/color/16/000000/google-logo.png' alt='Google icon' className='me-2' />
									Iniciar sesión con Google
								</button>
							</div>
							<Link to='/register' className='text-primary mt-3'>
								¿No tienes una cuenta? Regístrate aquí
							</Link>
						</form>
					</>
				)}
			</div>
		</div>
	);
};
