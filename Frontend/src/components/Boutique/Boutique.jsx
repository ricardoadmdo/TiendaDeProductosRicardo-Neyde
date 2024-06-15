import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Boutique = () => {
	return (
		<div className='bienvenida-container mt-5 animate__animated animate__fadeIn'>
			<h1 className='text-center mb-4'>¡Bienvenidos a nuestra Boutique de Ropa!</h1>
			<p className='text-center'>Descubre las últimas tendencias en moda y estilo.</p>

			{/* Sección de Catálogo*/}
			<div className='row justify-content-center'>
				<section className='col-md-5'>
					<h2>Explora Nuestro Catálogo</h2>
					<div className='card mb-4'>
						<LazyLoadImage
							threshold={10}
							effect='blur'
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1718041271/udua1fvzut5bnmali9pd.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
							objectFit='cover'
						/>
						<div className='card-body'>
							<p className='card-text'>Descubre nuestra amplia gama de productos de moda.</p>
							<Link to='/vestidos' className='btn btn-primary me-1'>
								Vestidos
							</Link>
							<Link to='/camisas' className='btn btn-primary me-1'>
								Camisas
							</Link>
							<Link to='/accesorios' className='btn btn-primary'>
								Accesorios
							</Link>
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

export default Boutique;
