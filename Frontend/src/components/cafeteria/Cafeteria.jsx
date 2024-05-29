import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholder from '../../images/placeholder.png';

export const Cafeteria = () => {
	return (
		<div className='bienvenida-container mt-5 animate__animated animate__fadeIn'>
			<h1 className='text-center mb-4'>¡Bienvenidos a la Cafetería de Ricardo & Neyde!</h1>
			<p className='text-center'>Explora nuestra deliciosa selección de productos y combos.</p>

			{/* Sección de Productos y Combos */}
			<div className='row justify-content-center'>
				<section className='col-md-5'>
					<h2>Explora Nuestros Productos</h2>
					<div className='card mb-4'>
						<LazyLoadImage
							threshold={10}
							effect='blur'
							placeholderSrc={placeholder}
							src='ruta/de/imagen/de/productos'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
							style={{ objectFit: 'cover' }}
						/>
						<div className='card-body'>
							<p className='card-text'>Descubre nuestra amplia gama de productos de alta calidad.</p>
							<Link to='/productos' className='btn btn-primary'>
								Ver Productos
							</Link>
						</div>
					</div>
				</section>

				<section className='col-md-5'>
					<h2>Combos Especiales</h2>
					<div className='card mb-3'>
						<LazyLoadImage
							threshold={10}
							effect='blur'
							placeholderSrc={placeholder}
							src='ruta/de/imagen/de/combos'
							className='card-img-top img-fluid'
							alt='Imagen del combo'
							style={{ objectFit: 'cover' }}
						/>
						<div className='card-body'>
							<p className='card-text'>Prueba nuestros irresistibles combos, perfectos para cualquier ocasión.</p>
							<Link to='/combos' className='btn btn-primary'>
								Ver Combos
							</Link>
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
