import { useState, useEffect } from 'react';
import Calendario from '../reutilizable-tablaCrud/Calendario';
import Pagination from '../reutilizable-tablaCrud/Pagination';
import Axios from 'axios';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';

const fetchVentas = async ({ queryKey }) => {
	const [, page, limit, fechas] = queryKey;
	try {
		const response = await Axios.get(`http://localhost:3001/api/venta?page=${page}&limit=${limit}&fechas=${fechas}`);
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.msg || 'Error al obtener ventas');
	}
};

const ReporteVentas = () => {
	const [diasSeleccionados, setDiasSeleccionados] = useState([new Date().toISOString().split('T')[0]]);
	const [currentPage, setCurrentPage] = useState(1);

	const fechasSeleccionadas = diasSeleccionados.join(',');

	const {
		data,
		isLoading,
		isError,
		error,
		refetch: refetchVentas,
	} = useQuery({
		queryKey: ['ventas', currentPage, 8, fechasSeleccionadas],
		queryFn: fetchVentas,
		keepPreviousData: true,
	});

	useEffect(() => {
		refetchVentas();
	}, [diasSeleccionados, currentPage]);

	const handleSeleccionarDias = (dias) => {
		setDiasSeleccionados(dias);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	return (
		<div className='container-fluid animate__animated animate__fadeIn p-3'>
			<h2 className='text-center mb-4'>Reporte de Ventas</h2>
			<Calendario onSeleccionarDias={handleSeleccionarDias} />
			<div className='mt-4'>
				{diasSeleccionados.length > 0 ? (
					<div>
						<h3 className='text-center'>Día Seleccionado:</h3>
						<h1 className='text-center'>{new Date(diasSeleccionados[0]).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</h1>
					</div>
				) : (
					<div className='alert alert-info text-center'>Selecciona una fecha del calendario</div>
				)}
			</div>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<div className='alert alert-danger mt-4'>Error: {error.message}</div>
			) : (
				<div className='mt-4'>
					<h3 className='text-center'>Ventas del Día:</h3>
					{data?.ventas.length > 0 ? (
						<div className='row'>
							{data?.ventas.map((venta) => (
								<div key={venta.uid} className='col-md-6'>
									<div className='card mb-4'>
										<div className='card-body'>
											<h5 className='card-title'>
												Fecha: {new Date(venta.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
											</h5>
											<p className='card-text'>Total Productos: {venta.totalProductos}</p>
											<p className='card-text'>Precio Total: ${venta.precioTotal}</p>
											<h6>Productos:</h6>
											<ul className='list-group'>
												{venta.productos.map((producto) => (
													<li key={producto._id} className='list-group-item'>
														{producto.nombre} - {producto.cantidad} x ${producto.precio}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='alert alert-info text-center'>No hay ventas para mostrar.</div>
					)}
					<Pagination
						currentPage={currentPage}
						totalPages={data.totalPages}
						handlePreviousPage={handlePreviousPage}
						handleNextPage={handleNextPage}
						className='mt-4'
					/>
				</div>
			)}
		</div>
	);
};

export default ReporteVentas;
