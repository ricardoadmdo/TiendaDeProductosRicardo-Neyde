import notFound from '../images/NotFound.jpg'; // Asegúrate de que la ruta de la imagen sea correcta

const NoEncontrado = () => {
	return (
		<div
			className='container-fluid text-center vh-100  animate__animated animate__fadeIn'
			style={{
				backgroundImage: `url(${notFound})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				color: 'white',
			}}
		>
			<div className='row h-100'>
				<div className='col d-flex justify-content-center align-items-center flex-column'>
					<h1 className='display-1 font-weight-bold'> Error 404</h1>
					<p className='lead'>Página no encontrada</p>
					<p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
					<a className='btn btn-outline-light' href='/'>
						Volver al inicio
					</a>
				</div>
			</div>
		</div>
	);
};

export default NoEncontrado;
