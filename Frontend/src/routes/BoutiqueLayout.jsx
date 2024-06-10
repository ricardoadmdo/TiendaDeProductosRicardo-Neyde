import { Outlet } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import NavbarBoutique from '../components/Boutique/ui/NavbarBoutique';

const BoutiqueLayout = () => (
	<>
		<NavbarBoutique />
		<div className='content'>
			<Outlet />
		</div>
		<Footer />
	</>
);

export default BoutiqueLayout;
