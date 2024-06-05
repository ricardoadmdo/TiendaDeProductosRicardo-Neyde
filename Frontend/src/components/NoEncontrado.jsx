export const NoEncontrado = () => {
	return (
		<>
			<div className='container text-center mt-5'>
				<div className='row'>
					<div className='col'>
						<h1 className='display-1 font-weight-bold'>404</h1>
						<p className='lead'>Página no encontrada</p>
						<p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
						<a className='btn btn-primary' href='/'>
							Volver al inicio
						</a>
					</div>
				</div>
			</div>
		</>
	);
};
