import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className='dark101720 footer-margin text-center text-white py-4'>
			<div className='container'>
				<h2>Contacto</h2>
				<p>Conéctate con nosotros:</p>
				<div className='d-flex justify-content-center mb-4'>
					<a
						style={{ color: '#00FF00' }}
						className='text-decoration-none mx-3'
						href='https://wa.me/+5358175289'
						target='_blank'
						rel='noopener noreferrer'
					>
						<FaWhatsapp size={30} style={{ color: '#00FF00' }} /> Whatsapp
					</a>
					<a
						style={{ color: '#00BFFF' }}
						className='text-decoration-none mx-3'
						href='https://www.facebook.com/ricardo.descoubet.1'
						target='_blank'
						rel='noopener noreferrer'
					>
						<FaFacebook size={30} style={{ color: '#00BFFF' }} /> Facebook
					</a>
					<a
						style={{ color: '#FF6347' }}
						className='text-decoration-none mx-3'
						href='https://www.instagram.com/ricardoluisdescoubetbravo'
						target='_blank'
						rel='noopener noreferrer'
					>
						<FaInstagram size={30} style={{ color: '#FF6347' }} /> Instagram
					</a>
				</div>

				{/* Avisos Legales */}
				<div className='mt-3'>
					<span>&copy; {year} Ricardo & Neyde. Todos los derechos reservados.</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
