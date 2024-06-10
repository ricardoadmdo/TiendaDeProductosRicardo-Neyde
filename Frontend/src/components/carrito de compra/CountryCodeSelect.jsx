import PropTypes from 'prop-types';

const countryCodes = [
	{ code: '+53', name: 'Cuba' },
	{ code: '+1', name: 'Estados Unidos' },
	{ code: '+7', name: 'Rusia' },
	{ code: '+86', name: 'China' },
	{ code: '+91', name: 'India' },
	{ code: '+55', name: 'Brasil' },
	{ code: '+33', name: 'Francia' },
	{ code: '+49', name: 'Alemania' },
	{ code: '+39', name: 'Italia' },
	{ code: '+44', name: 'Reino Unido' },
	{ code: '+81', name: 'Japón' },
	{ code: '+82', name: 'Corea del Sur' },
	{ code: '+34', name: 'España' },
	{ code: '+52', name: 'México' },
	{ code: '+54', name: 'Argentina' },
	{ code: '+61', name: 'Australia' },
	{ code: '+64', name: 'Nueva Zelanda' },
	{ code: '+56', name: 'Chile' },
	{ code: '+57', name: 'Colombia' },
	{ code: '+593', name: 'Ecuador' },
	{ code: '+51', name: 'Perú' },
	{ code: '+507', name: 'Panamá' },
	{ code: '+591', name: 'Bolivia' },
	{ code: '+502', name: 'Guatemala' },
	{ code: '+503', name: 'El Salvador' },
	{ code: '+504', name: 'Honduras' },
	{ code: '+505', name: 'Nicaragua' },
	{ code: '+506', name: 'Costa Rica' },
];

const CountryCodeSelect = ({ value, onChange }) => {
	return (
		<select className='form-control me-2' value={value} onChange={onChange}>
			{countryCodes.map((country) => (
				<option key={country.code} value={country.code}>
					{country.name} ({country.code})
				</option>
			))}
		</select>
	);
};

CountryCodeSelect.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
};

export default CountryCodeSelect;
