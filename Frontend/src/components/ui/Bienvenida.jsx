import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholder from '../../images/placeholder.png';

const Bienvenida = () => {
	return (
		<div className='bienvenida container mt-5 animate__animated animate__fadeIn'>
			<h1 className='text-center mb-4'>Bienvenidos a Ricardo & Neyde</h1>
			<p className='text-center'>Explora nuestra selección exclusiva de productos y combos de comida en La Habana.</p>

			{/* Sección de Productos y Combos */}
			<div className='row justify-content-center'>
				<section className='col-md-5'>
					<h2>Explora Nuestros Productos</h2>
					<div className='card mb-4'>
						<LazyLoadImage
							effect='opacity'
							placeholderSrc={placeholder}
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/dtybbo5xcuw8m4ur1tib.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
							style={{ objectFit: 'cover' }}
							width='600'
							height='400'
							loading='eager'
							srcSet='
								https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/dtybbo5xcuw8m4ur1tib.jpg 600w,
								https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/dtybbo5xcuw8m4ur1tib_small.jpg 300w
							'
							sizes='(max-width: 600px) 300px, 600px'
						/>
						<div className='card-body'>
							<p className='card-text'>Descubre nuestra amplia gama de productos seleccionados con la mayor calidad.</p>
							<Link to='/productos' className='btn btn-dark'>
								Ver Productos
							</Link>
						</div>
					</div>
				</section>

				<section className='col-md-5'>
					<h2>Combos Especiales</h2>
					<div className='card mb-3'>
						<LazyLoadImage
							effect='opacity'
							placeholderSrc={placeholder}
							src='https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/kkplmrpcfpfftbg1lbby.jpg'
							className='card-img-top img-fluid'
							alt='Imagen del producto'
							style={{ objectFit: 'cover' }}
							width='600'
							height='400'
							loading='eager'
							srcSet='
								https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/kkplmrpcfpfftbg1lbby.jpg 600w,
								https://res.cloudinary.com/dber1pxea/image/upload/v1716711600/kkplmrpcfpfftbg1lbby_small.jpg 300w
							'
							sizes='(max-width: 600px) 300px, 600px'
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
						placeholderSrc={placeholder}
						src='https://res.cloudinary.com/dber1pxea/image/upload/v1716711597/kjgjpyl3rf4drlm6uthd.jpg'
						className='card-img-top img-fluid'
						alt='Imagen del producto'
						style={{ height: '200px', objectFit: 'cover' }}
						width='600'
						height='200'
						loading='eager'
						srcSet='
							https://res.cloudinary.com/dber1pxea/image/upload/v1716711597/kjgjpyl3rf4drlm6uthd.jpg 600w,
							https://res.cloudinary.com/dber1pxea/image/upload/v1716711597/kjgjpyl3rf4drlm6uthd_small.jpg 300w
						'
						sizes='(max-width: 600px) 300px, 600px'
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
	);
};

export default Bienvenida;
