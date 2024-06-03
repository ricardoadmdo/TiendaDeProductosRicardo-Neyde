import './styles.css';

const LoadingSpinner = () => {
	return (
		<div className='container-fluid d-flex justify-content-center align-items-center vh-100'>
			<div className='spinner-container'>
				<div className='spinner'>
					<div className='double-bounce1'></div>
					<div className='double-bounce2'></div>
				</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
