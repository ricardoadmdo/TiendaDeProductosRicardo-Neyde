import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

const BusinessStatus = lazy(() => import('./BusinessStatus'));

const Bienvenida = () => {
	return (
		<>
			<div className='bienvenida container mt-5 animate__animated animate__fadeIn'>
				<h1 className='text-center mb-4'>Bienvenidos a Ricardo & Neyde</h1>
				<Suspense fallback={<LoadingSpinner />}>
					<BusinessStatus />
				</Suspense>

				<p className='text-center'>Explora nuestra selección exclusiva de productos y combos de comida en La Habana.</p>

				{/* Sección de Productos y Combos */}
				<div className='row justify-content-center'>
					<section className='col-md-5 mb-5'>
						<h2>Explora Nuestros Productos</h2>
						<div className='card mb-4'>
							<LazyLoadImage
								threshold={10}
								effect='opacity'
								src='https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/dtybbo5xcuw8m4ur1tib.jpg'
								className='card-img-top img-fluid'
								alt='Imagen del producto'
							/>
							<div className='card-body'>
								<p className='card-text'>Descubre nuestra amplia gama de productos seleccionados con la mayor calidad.</p>
								<Link to='/productos' className='btn btn-dark'>
									Ver Productos
								</Link>
							</div>
						</div>
					</section>

					<section className='col-md-5 mb-5'>
						<h2>Combos Especiales</h2>
						<div className='card mb-3'>
							<LazyLoadImage
								effect='opacity'
								src='https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/kkplmrpcfpfftbg1lbby.jpg'
								className='card-img-top img-fluid'
								alt='Imagen del producto'
							/>
							<div className='card-body'>
								<p className='card-text'>Prueba nuestros irresistibles combos, perfectos para cualquier ocasión.</p>
								<Link to='/combos' className='btn btn-dark'>
									Ver Combos
								</Link>
							</div>
						</div>
					</section>
				</div>

				{/* Sección de Cafeteria */}
				<div className='container my-5'>
					<h3 className='text-center mb-4'>Visita nuestra Cafetería y disfruta de la mejor comida</h3>
					<p className='text-justify'>
						En Ricardo & Neyde Cafetería tenemos una amplia variedad de pastas , comida cubana, mariscos , arroces y carnes de gran
						calidad y sabor.
					</p>
					<hr />
					<div className='card mb-4'>
						<LazyLoadImage
							effect='opacity'
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1718041269/ota6mfg9z7yz6uyh9adz.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
						/>
						<div className='card-body text-center'>
							<p className='card-text'>Descubre nuestra amplia gama de productos seleccionados con la mayor calidad.</p>
							<Link to='/cafeteria' className='btn btn-dark'>
								Ir a la Cafetería
							</Link>
						</div>
					</div>
				</div>

				{/* Sección de Boutique */}
				<div className='container my-5'>
					<h3 className='text-center mb-4'>Visita nuestra Boutique y llévate la tela de mejor calidad</h3>
					<p className='text-justify'>
						En Ricardo & Neyde Boutique tenemos telas de todos tipos y tallas, para todo el publico. Camisas, Blusas, Zapatos.,
						Pantalones, Vestidos, etc
					</p>
					<hr />
					<div className='card mb-4'>
						<LazyLoadImage
							effect='opacity'
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1718041271/udua1fvzut5bnmali9pd.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
						/>
						<div className='card-body text-center'>
							<p className='card-text'>Descubre nuestra amplia gama de productos seleccionados con la mayor calidad.</p>
							<Link to='/boutique' className='btn btn-dark'>
								Ir a la Boutique
							</Link>
						</div>
					</div>
				</div>

				{/* Sección Vista de Tienda */}
				<div className='container my-5'>
					<h3 className='text-center mb-4'>Más acerca de nuestra tienda Ricardo & Neyde</h3>
					<p className='text-justify'>
						Ricardo & Neyde es una tienda especializada en ofrecer los <strong>mejores productos y combos de comida</strong> en La Habana.
						Descubre nuestra amplia variedad de productos de alta calidad y disfruta de nuestros deliciosos{' '}
						<strong>combos de alta gama</strong>.
					</p>
					<hr />
					<div className='card mb-4'>
						<LazyLoadImage
							effect='opacity'
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1718041412/i0agcr3wwtibxdhwgoo6.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
						/>
						<div className='card-body text-center'>
							<p className='card-text'>Nuestra tienda en San Miguel, calle Delicia, Las Piedras, La Habana, Cuba.</p>
						</div>
					</div>
				</div>

				{/* Sección de Ubicación */}
				<section className='text-center mt-4'>
					<h2>Encuéntranos en La Habana</h2>
					<p>Visita nuestra tienda en San Miguel, calle Delicia, Las Piedras, La Habana, Cuba.</p>
					<div
						className='my-4'
						dangerouslySetInnerHTML={{
							__html: `
        <iframe
            title='ubicación google maps de la tienda'
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3670.7048252406435!2d-82.29946848126039!3d23.071280811154583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDA0JzE2LjciTiA4MsKwMTcnNTguMyJX!5e0!3m2!1ses-419!2scu!4v1716698429508!5m2!1ses-419!2scu&maptype=terrain"
            width="100%"
            height="450"
            style="border:0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      `,
						}}
						style={{ width: '100%', height: '450px', maxWidth: '600px', margin: 'auto' }}
					/>
				</section>
			</div>
		</>
	);
};

export default Bienvenida;
