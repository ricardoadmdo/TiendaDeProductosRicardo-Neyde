import { useState, useEffect, lazy, Suspense } from 'react';
import Axios from 'axios';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import useExchangeRates from '../../hooks/useExchangeRates';
import ErrorComponent from '../ui/ErrorComponent';
const Calendario = lazy(() => import('../reutilizable-tablaCrud/Calendario'));
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination'));

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
	const { usdRate } = useExchangeRates();
	const [diasSeleccionados, setDiasSeleccionados] = useState([new Date().toISOString().split('T')[0]]);
	const [currentPage, setCurrentPage] = useState(1);

	const fechasSeleccionadas = diasSeleccionados.join(',');

	const {
		data,
		isLoading,
		isError,
		refetch: refetchVentas,
	} = useQuery({
		queryKey: ['ventas', currentPage, 8, fechasSeleccionadas],
		queryFn: fetchVentas,
		keepPreviousData: true,
	});

	useEffect(() => {
		refetchVentas();
	}, [diasSeleccionados, currentPage, refetchVentas]);

	const handleSeleccionarDias = (dias) => {
		setDiasSeleccionados(dias);
		setCurrentPage(1);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	// Para agregar las ventas por fechas y calcular la ganancia
	const agruparVentasPorFecha = (ventas) => {
		const groupedVentas = ventas.reduce((groupedVentas, venta) => {
			const fecha = new Date(venta.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
			if (!groupedVentas[fecha]) {
				groupedVentas[fecha] = { ventas: [], totalProductos: 0, totalDinero: 0, totalGanancia: 0 };
			}
			let gananciaVenta = 0;
			venta.productos.forEach((producto) => {
				const gananciaProducto = (producto.precio - producto.precioCosto) * producto.cantidad;
				gananciaVenta += gananciaProducto;
			});
			groupedVentas[fecha].ventas.push(venta);
			groupedVentas[fecha].totalProductos += venta.totalProductos;
			groupedVentas[fecha].totalDinero += venta.precioTotal;
			groupedVentas[fecha].totalGanancia += gananciaVenta;
			return groupedVentas;
		}, {});

		return groupedVentas;
	};

	return (
		<div className='container animate__animated animate__fadeIn p-3'>
			<h2 className='text-center mb-4'>Reporte de Ventas</h2>
			<Suspense fallback={<LoadingSpinner />}>
				<Calendario onSeleccionarDias={handleSeleccionarDias} />
			</Suspense>

			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<ErrorComponent />
			) : (
				<div className='mt-4 my-2'>
					{data?.ventas.length > 0 ? (
						Object.entries(agruparVentasPorFecha(data.ventas)).map(([fecha, { ventas, totalProductos, totalDinero, totalGanancia }]) => (
							<div key={fecha}>
								<br />
								<h3 className='text-center'>Ventas del dia de hoy: {fecha}</h3>
								<div className='text-center mb-3'>
									<h3>Detalles de la venta del dia de hoy</h3>
									<strong>Total de Productos Vendidos:</strong> {totalProductos} | <strong>Total Recaudado:</strong> $
									{totalDinero.toFixed(2)} CUP | <strong>Total Recaudado:</strong> ${(totalDinero / usdRate).toFixed(2)} USD |{' '}
									<strong>Ganancia Total:</strong> ${totalGanancia.toFixed(2)} CUP | <strong>Ganancia Total:</strong> $
									{(totalGanancia / usdRate).toFixed(2)} USD
								</div>
								<hr />
								<div className='table-responsive'>
									<table className='table table-striped'>
										<thead>
											<tr>
												<th>Hora</th>
												<th>Total Productos</th>
												<th>Precio Total CUP</th>
												<th>Precio Total USD</th>
												<th>Tipo de Pago</th>
												<th>Productos</th>
												<th>Cliente</th>
											</tr>
										</thead>
										<tbody>
											{ventas.map((venta) => (
												<tr key={venta.uid}>
													<td>
														{new Date(venta.fecha).toLocaleString('es-ES', {
															timeZone: 'UTC',
															hour: '2-digit',
															minute: '2-digit',
															second: '2-digit',
														})}
													</td>

													<td>{venta.totalProductos}</td>
													<td>${venta.precioTotal.toFixed(2)}</td>
													<td>${(venta.precioTotal / usdRate).toFixed(2)}</td>
													<td>
														{venta.tipoPago === 'presencial' && (
															<span className='tipo-pago-presencial'>Pago Presencial</span>
														)}
														{venta.tipoPago === 'online' && <span className='tipo-pago-online'>Pago con Tarjeta</span>}
														{venta.tipoPago === 'dependiente' && (
															<span className='tipo-pago-en-tienda'>En la Tienda</span>
														)}
													</td>
													<td>
														<ul className='list-group'>
															{venta.productos.map((producto) => (
																<li key={producto._id} className='list-group-item'>
																	{producto.nombre} - {producto.cantidad} x ${producto.precio.toFixed(2)}
																</li>
															))}
														</ul>
													</td>

													<td>
														{venta.cliente ? (
															<>
																<strong>{venta.cliente.nombre}</strong>
																<br />
																Teléfono: {venta.cliente.telefono}
																<br />
																Dirección: {venta.cliente.direccion}, {venta.cliente.municipio},{' '}
																{venta.cliente.reparto}
															</>
														) : (
															'En la Tienda'
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						))
					) : (
						<div className='alert alert-info text-center'>No hay ventas para mostrar.</div>
					)}
					<Suspense fallback={<LoadingSpinner />}>
						<Pagination
							currentPage={currentPage}
							totalPages={data.totalPages}
							handlePreviousPage={handlePreviousPage}
							handleNextPage={handleNextPage}
							className='mt-4'
						/>
					</Suspense>
				</div>
			)}
		</div>
	);
};

export default ReporteVentas;
