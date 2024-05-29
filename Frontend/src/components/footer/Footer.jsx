import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className=' footer bg-dark text-center text-white py-4 margin-top:6em' style={{ width: '100%' }}>
			<div className='container'>
				<h2>Contacto</h2>
				<p>Conéctate con nosotros:</p>
				<div className='d-flex justify-content-center'>
					<a className='text-decoration-none text-success mx-3' href='https://wa.me/+5358175289' target='_blank' rel='noopener noreferrer'>
						<FaWhatsapp size={30} /> Whatsapp
					</a>
					<a
						className='text-decoration-none text-primary mx-3'
						href='https://www.facebook.com/ricardo.descoubet.1'
						target='_blank'
						rel='noopener noreferrer'
					>
						<FaFacebook size={30} /> Facebook
					</a>
					<a
						className='text-decoration-none text-danger mx-3'
						href='https://www.instagram.com/ricardoluisdescoubetbravo'
						target='_blank'
						rel='noopener noreferrer'
					>
						<FaInstagram size={30} /> Instagram
					</a>
				</div>
				<div className='mt-3'>
					<span> {year}</span>
				</div>
			</div>
		</footer>
	);
};
export default Footer;
