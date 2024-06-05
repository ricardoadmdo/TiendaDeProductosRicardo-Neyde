const { Schema, model } = require('mongoose');

const VentaSchema = Schema({
	nombre: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

VentaSchema.methods.toJSON = function () {
	const { __v, _id, ...venta } = this.toObject();
	usuario.uid = _id;
	return venta;
};

module.exports = model('Venta', VentaSchema);
