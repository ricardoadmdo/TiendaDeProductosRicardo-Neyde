const { Schema, model } = require('mongoose');

const VentaSchema = Schema({
	producto: {
		type: String,
		required: true,
	},
	cantidad: {
		type: Number,
		required: true,
	},
	fecha: {
		type: Date,
		default: Date.now, // Puedes establecer la fecha actual como valor por defecto
	},
});

VentaSchema.methods.toJSON = function () {
	const { __v, _id, ...venta } = this.toObject();
	venta.id = _id; // Cambio 'usuario.uid' a 'venta.id'
	return venta;
};

module.exports = model('Venta', VentaSchema);
