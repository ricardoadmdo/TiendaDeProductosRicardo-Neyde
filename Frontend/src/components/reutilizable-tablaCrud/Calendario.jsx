import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import './styles.css';

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
			// Convert dates to local ISO string without time
			const fechasFormateadas = updatedSelectedDates.map((dia) => {
				const localDate = new Date(dia.getTime() - dia.getTimezoneOffset() * 60000);
				return localDate.toISOString().split('T')[0];
			});
			onSeleccionarDias(fechasFormateadas);
			return updatedSelectedDates;
		});
	};
	const handleToggleMonth = () => {
		const allDays = eachDayOfInterval({ start, end });
		const allSelected = allDays.every((day) => selectedDates.some((selectedDay) => isSameDay(selectedDay, day)));

		if (allSelected) {
			setSelectedDates([]);
			onSeleccionarDias([]);
		} else {
			setSelectedDates(allDays);
			const fechasFormateadas = allDays.map((dia) => {
				const localDate = new Date(dia.getTime() - dia.getTimezoneOffset() * 60000);
				return localDate.toISOString().split('T')[0];
			});
			onSeleccionarDias(fechasFormateadas);
		}
	};

	return (
		<div className='calendar-container calendar'>
			<div className='col-md-4'>
				<div
					className='calendar-left text-uppercase'
					style={{ backgroundImage: `url(https://res.cloudinary.com/dber1pxea/image/upload/v1718429890/wrjz2wn8txxeeev3imxd.jpg)` }}
				>
					<h3 className='text-white'>{format(currentDate, 'MMMM yyyy', { locale: es })}</h3>
					<p className='text-white'>
						{selectedDates.length > 0
							? format(selectedDates[selectedDates.length - 1], 'd MMMM yyyy', { locale: es })
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
				<div className='d-flex justify-content-center mt-3'>
					<button className='btn btn-dark' onClick={handleToggleMonth}>
						{selectedDates.length === days.length ? 'Desmarcar todo el Mes' : 'Seleccionar todo el Mes'}
					</button>
				</div>
			</div>
		</div>
	);
};

Calendario.propTypes = {
	onSeleccionarDias: PropTypes.func.isRequired,
};

export default Calendario;
