import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import Footer from '../components/footer/Footer';

const MainLayout = () => (
	<>
		<Navbar />
		<div className='main-content'>
			<Outlet />
		</div>
		<Footer />
	</>
);

export default MainLayout;
