import { useState, useEffect } from 'react';
import Calendario from '../reutilizable-tablaCrud/Calendario';
import Pagination from '../reutilizable-tablaCrud/Pagination';
import Axios from 'axios';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';

const fetchVentas = async ({ queryKey }) => {
	const [, page, limit, fecha] = queryKey;
	try {
		const response = await Axios.get(`http://localhost:3001/api/venta?page=${page}&limit=${limit}&fecha=${fecha}`);
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.msg || 'Error al obtener ventas');
	}
};

const ReporteVentas = () => {
	const [diasSeleccionados, setDiasSeleccionados] = useState([new Date()]); // Por defecto, seleccionamos el día actual
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (diasSeleccionados.length > 0) {
			const fechaSeleccionada = diasSeleccionados[0];
			refetchVentas(currentPage, fechaSeleccionada);
		}
	}, [diasSeleccionados, currentPage]);

	const handleSeleccionarDias = (dias) => {
		const fechas = dias.map((fechaString) => new Date(fechaString));
		setDiasSeleccionados(fechas);
	};

	const {
		data,
		isLoading,
		isError,
		error,
		refetch: refetchVentas,
	} = useQuery({
		queryKey: ['ventas', currentPage, 8, diasSeleccionados[0]?.toISOString().split('T')[0]],
		queryFn: fetchVentas,
		keepPreviousData: true,
	});

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	return (
		<div className='container-fluid animate__animated animate__fadeIn p-3'>
			<h2 className='text-center mb-4'>Reporte de Ventas</h2>
			<Calendario onSeleccionarDias={handleSeleccionarDias} />
			<div className='mt-4'>
				<h3>Día Seleccionado:</h3>
				<ul className='list-unstyled'>
					{diasSeleccionados.map((fecha, index) => (
						<li key={index}>{fecha.toLocaleDateString()}</li>
					))}
				</ul>
			</div>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<div className='alert alert-danger mt-4'>Error: {error.message}</div>
			) : (
				<>
					<div className='list-group mt-4'>
						{data?.ventas.map((venta) => (
							<div key={venta.uid} className='list-group-item'>
								<h5 className='mb-1'>Fecha: {new Date(venta.fecha).toLocaleDateString()}</h5>
								<p className='mb-1'>Total Productos: {venta.totalProductos}</p>
								<p className='mb-1'>Precio Total: ${venta.precioTotal}</p>
								<h6>Productos:</h6>
								<ul className='list-unstyled'>
									{venta.productos.map((producto) => (
										<li key={producto._id}>
											{producto.nombre} - {producto.cantidad} x ${producto.precio}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<Pagination
						currentPage={currentPage}
						totalPages={data?.totalPages || 0}
						handlePreviousPage={handlePreviousPage}
						handleNextPage={handleNextPage}
						className='mt-4'
					/>
				</>
			)}
		</div>
	);
};

export default ReporteVentas;
