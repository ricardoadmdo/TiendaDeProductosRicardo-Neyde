const Menu = () => {
	return (
		<div className='bienvenida-container mt-5 animate__animated animate__fadeIn'>
			<h1 className='text-center mb-4'>¡Bienvenidos a nuestra Cafetería!</h1>
			<p className='text-center'>Explora nuestra deliciosa selección de productos y combos.</p>

			{/* Sección de Menú*/}
			<div className='row justify-content-center'>
				<section className='col-md-5'>
					<h2>Explora Nuestro Menú</h2>
					<div className='card mb-4'>
						<div className='card-body'>
							<p className='card-text'>Descubre nuestra amplia gama de productos de alta calidad.</p>
							<div>
								<h3>Carnes</h3>
								<ul>
									<li>Bistec de Res - $10</li>
									<li>Pollo Asado - $8</li>
									<li>Cerdo Adobado - $9</li>
								</ul>
							</div>
							<div>
								<h3>Comida Cubana</h3>
								<ul>
									<li>Ropa Vieja - $12</li>
									<li>Arroz con Pollo - $10</li>
									<li>Lechón Asado - $11</li>
								</ul>
							</div>
							<div>
								<h3>Pastas</h3>
								<ul>
									<li>Spaghetti Carbonara - $9</li>
									<li>Lasaña de Carne - $11</li>
									<li>Ravioli de Queso - $8</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Más acerca de la cafetería */}
			<div className='container my-5'>
				<h3 className='text-center mb-4'>Más Acerca de la Cafetería de Ricardo & Neyde</h3>
				<p className='text-justify'>
					Nuestra cafetería ofrece una amplia variedad de deliciosos productos, desde pizzas y hamburguesas hasta espaguetis y mucho más.
					Disfruta de la mejor comida en un ambiente acogedor y amigable.
				</p>
				{/* Agregar más información sobre la cafetería si es necesario */}
			</div>
		</div>
	);
};

export default Menu;
