const BoutiqueMenu = () => {
	return (
		<div className='bienvenida-container mt-5 animate__animated animate__fadeIn'>
			<h1 className='text-center mb-4'>¡Bienvenidos a nuestra Boutique de Ropa!</h1>
			<p className='text-center'>Explora nuestra selección de moda de alta calidad.</p>

			{/* Sección de Menú*/}
			<div className='row justify-content-center'>
				<section className='col-md-5'>
					<h2>Explora Nuestro Catálogo</h2>
					<div className='card mb-4'>
						<div className='card-body'>
							<p className='card-text'>Descubre nuestra amplia gama de productos de moda.</p>
							<div>
								<h3>Ropa para Mujer</h3>
								<ul>
									<li>Vestido Floral - $50</li>
									<li>Jeans Skinny - $40</li>
									<li>Blusa de Encaje - $35</li>
								</ul>
							</div>
							<div>
								<h3>Ropa para Hombre</h3>
								<ul>
									<li>Camisa de Cuadros - $45</li>
									<li>Pantalón Chino - $50</li>
									<li>Camiseta Estampada - $30</li>
								</ul>
							</div>
							<div>
								<h3>Accesorios</h3>
								<ul>
									<li>Bolso de Cuero - $60</li>
									<li>Gorra de Béisbol - $25</li>
									<li>Gafas de Sol - $40</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Más acerca de la boutique */}
			<div className='container my-5'>
				<h3 className='text-center mb-4'>Más Acerca de Nuestra Boutique de Ropa</h3>
				<p className='text-justify'>
					Nuestra boutique ofrece una amplia variedad de ropa y accesorios de moda para hombres y mujeres. Encuentra prendas de calidad que
					te harán lucir elegante y a la moda en cualquier ocasión.
				</p>
				{/* Agregar más información sobre la boutique si es necesario */}
			</div>
		</div>
	);
};

export default BoutiqueMenu;
