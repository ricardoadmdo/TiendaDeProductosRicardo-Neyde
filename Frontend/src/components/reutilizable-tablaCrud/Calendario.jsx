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
		<div className='calendar-container calendar'>
			<div className='col-md-4'>
				<div className='calendar-left text-uppercase' style={{ backgroundImage: `url(${bg})` }}>
					<h3 className='text-white'>{format(currentDate, 'MMMM yyyy', { locale: es })}</h3>
					<p className='text-white'>
						{selectedDates.length > 0
							? format(selectedDates[0], 'd MMMM yyyy', { locale: es })
							: format(today, 'd MMMM yyyy', { locale: es })}
					</p>
				</div>
				<div className='d-flex align-items-center justify-content-between p-3'>
					<button className='btn me-5' onClick={handlePrevMonth}>
						<i className='fa fa-chevron-left'></i>
					</button>
					<h3 className='text-uppercase me-5'>{format(currentDate, 'MMMM yyyy', { locale: es })}</h3>
					<button className='btn' onClick={handleNextMonth}>
						<i className='fa fa-chevron-right'></i>
					</button>
				</div>
				<div className='table-responsive'>
					<table className='table table-bordered mb-0'>
						<thead>
							<tr className='table'>
								{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
									<th key={day} className='text-center'>
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
											className={`text-center ${isSameMonth(day, currentDate) ? '' : 'text-muted'} ${
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
	);
};

Calendario.propTypes = {
	onSeleccionarDias: PropTypes.func.isRequired,
};

export default Calendario;
