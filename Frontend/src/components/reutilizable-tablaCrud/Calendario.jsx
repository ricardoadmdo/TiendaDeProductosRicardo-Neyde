import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import bg from '../../images/bg.jpg';

const Calendario = ({ onSeleccionarDias }) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDates, setSelectedDates] = useState([]);

	const start = startOfMonth(currentDate);
	const end = endOfMonth(currentDate);
	const days = eachDayOfInterval({ start, end });
	const today = new Date();

	const handlePrevMonth = () => {
		setCurrentDate(subMonths(currentDate, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(addMonths(currentDate, 1));
	};

	const handleDateClick = (day) => {
		setSelectedDates((prevSelectedDates) => {
			const updatedSelectedDates = [...prevSelectedDates];
			const index = updatedSelectedDates.findIndex((selectedDay) => isSameDay(selectedDay, day));
			if (index !== -1) {
				updatedSelectedDates.splice(index, 1);
			} else {
				updatedSelectedDates.push(day);
			}
			// Llama a la función de manejo proporcionada por el componente padre con las fechas formateadas
			const fechasFormateadas = updatedSelectedDates.map((dia) => format(dia, 'd MMMM yyyy', { locale: es }));
			onSeleccionarDias(fechasFormateadas);
			return updatedSelectedDates;
		});
	};

	return (
		<div className='container my-4 '>
			<div className='calendar d-flex'>
				<div
					className='calendar-left'
					style={{
						backgroundImage: `url(${bg})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				>
					<h3 className='uppercase'>{format(currentDate, 'MMMM yyyy', { locale: es })}</h3>
					<p>
						{selectedDates.length > 0
							? format(selectedDates[0], 'd MMMM yyyy', { locale: es })
							: format(today, 'd MMMM yyyy', { locale: es })}
					</p>
				</div>
				<div className='calendar-right'>
					<div className='calendar-header d-flex justify-content-between align-items-center p-3'>
						<button className='btn btn-primary rounded-circle' onClick={handlePrevMonth}>
							&lt;
						</button>
						<h3 className='uppercase'>{format(currentDate, 'MMMM yyyy', { locale: es })}</h3>
						<button className='btn btn-primary rounded-circle' onClick={handleNextMonth}>
							&gt;
						</button>
					</div>
					<div className='table-responsive'>
						<table className='table table-bordered mb-0'>
							<thead>
								<tr>
									{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
										<th key={day} className='text-center p-2'>
											{day}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
									<tr key={weekIndex}>
										{days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => (
											<td
												key={day}
												onClick={() => handleDateClick(day)}
												className={`text-center p-2 ${isSameMonth(day, currentDate) ? '' : 'text-muted'} ${
													isSameDay(day, today) ? 'today' : ''
												} ${selectedDates.find((selectedDay) => isSameDay(selectedDay, day)) ? 'selected' : ''}`}
											>
												{format(day, 'd')}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

Calendario.propTypes = {
	onSeleccionarDias: PropTypes.func.isRequired,
};

export default Calendario;
