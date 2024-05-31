// Frontend: VerificationScreen.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from 'axios';

export const VerificationScreen = () => {
	const [code, setCode] = useState('');
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleVerifyCode = (e) => {
		e.preventDefault();
		Axios.post(`http://localhost:3001/api/auth/login/${email}`, { code })
			.then(() => {
				Swal.fire({
					title: 'Código verificado correctamente, por favor inicie sesión',
					icon: 'success',
				});
				navigate('/login');
			})
			.catch((error) => {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: error.response.data.msg,
				});
			});
	};

	return (
		<div className='container'>
			<h2>Verificar Código</h2>
			<form onSubmit={handleVerifyCode}>
				<div className='form-group'>
					<label>Correo electrónico:</label>
					<input type='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className='form-group'>
					<label>Código:</label>
					<input type='text' className='form-control' value={code} onChange={(e) => setCode(e.target.value)} required />
				</div>
				<button type='submit' className='btn btn-primary'>
					Verificar
				</button>
			</form>
		</div>
	);
};
