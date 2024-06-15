import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const AnimatedNumber = ({ value }) => {
	const [animatedValue, setAnimatedValue] = useState(value);
	const [animationClass, setAnimationClass] = useState('');

	useEffect(() => {
		setAnimatedValue(value);

		// Forzar el reinicio de la animación eliminando y volviendo a agregar la clase
		setAnimationClass('');
		const animationTimeout = setTimeout(() => {
			setAnimationClass('animate__animated animate__bounceIn animate__fast');
		}, 10); // Un pequeño retraso para reiniciar la animación

		// Limpiar la clase de animación después de la duración de la animación
		const clearClassTimeout = setTimeout(() => {
			setAnimationClass('');
		}, 1000);

		return () => {
			clearTimeout(animationTimeout);
			clearTimeout(clearClassTimeout);
		};
	}, [value]);

	return <div className={`animated-number ${animationClass}`}>{Math.floor(animatedValue)}</div>;
};

AnimatedNumber.propTypes = {
	value: PropTypes.number.isRequired,
};

export default AnimatedNumber;
