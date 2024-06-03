import PropTypes from 'prop-types';

export const Pagination = ({ currentPage, totalPages, handlePreviousPage, handleNextPage }) => {
	return (
		<div className='d-flex justify-content-center mt-4 my-4'>
			<button className='btn btn-outline-dark mr-2 me-2' onClick={handlePreviousPage} disabled={currentPage === 1}>
				Anterior
			</button>
			<span className='align-self-center me-2'>
				{currentPage} de {totalPages}
			</span>
			<button className='btn btn-outline-dark ml-2' onClick={handleNextPage} disabled={currentPage === totalPages}>
				Siguiente
			</button>
		</div>
	);
};

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	handlePreviousPage: PropTypes.func.isRequired,
	handleNextPage: PropTypes.func.isRequired,
};

export default Pagination;
