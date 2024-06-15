import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Cafeteria = () => {
	return (
		<div className='bienvenida-container mt-5 animate__animated animate__fadeIn'>
			<h1 className='text-center mb-4'>¡Bienvenidos a nuestra Cafetería!</h1>
			<p className='text-center'>Explora nuestra deliciosa selección de productos y combos.</p>

			{/* Sección de Menú*/}
			<div className='row justify-content-center'>
				<section className='col-md-5'>
					<h2>Explora Nuestro Menú </h2>
					<div className='card mb-4'>
						<LazyLoadImage
							threshold={10}
							effect='blur'
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1717128320/011e3d91c7bf417a150ac7902da3b669--menu-design-menus_kywi7e.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
						/>
						<div className='card-body'>
							<p className='card-text'>Descubre nuestra amplia gama de productos de alta calidad.</p>
							<Link to='/pastas' className='btn btn-primary me-1'>
								Pastas
							</Link>
							<Link to='/carnes' className='btn btn-primary me-1'>
								Carnes
							</Link>
							<Link to='/cubana' className='btn btn-primary'>
								Comida Cubana
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

export default Cafeteria;
