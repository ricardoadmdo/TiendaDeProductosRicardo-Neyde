import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import Axios from 'axios';

export const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);

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

	const handleLogin = async (e, email, password) => {
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
				<h3 className='mb-3'>Bienvenido Amigo!</h3>
				<h2 className='mb-4'>Inicia Sesión</h2>
				<form className='d-grid gap-3' onSubmit={(e) => handleLogin(e, email, password)}>
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
					<Link to='/register' className='text-primary'>
						¿No tienes una cuenta? Regístrate aquí
					</Link>
				</form>
			</div>
		</div>
	);
};
