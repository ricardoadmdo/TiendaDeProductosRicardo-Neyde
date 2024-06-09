import { useState } from 'react';
import Calendario from '../reutilizable-tablaCrud/Calendario';

const Ventas = () => {
	const [diasSeleccionados, setDiasSeleccionados] = useState([]);

	const handleSeleccionarDias = (dias) => {
		setDiasSeleccionados(dias);
	};

	return (
		<div className='container animate__animated animate__fadeIn vh-100'>
			<h2>Registro de Ventas</h2>
			<Calendario onSeleccionarDias={handleSeleccionarDias} />
			<div>
				<h3>Días Seleccionados:</h3>
				<ul>
					{diasSeleccionados.map((fecha, index) => (
						<li key={index}>{fecha}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Ventas;
