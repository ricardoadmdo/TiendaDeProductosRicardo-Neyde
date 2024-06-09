const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	cantidad: {
		type: Number,
		required: true,
	},
	precio: {
		type: Number,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	estado: {
		type: Boolean,
		default: true,
	},
});

const VentaSchema = new Schema({
	productos: {
		type: [ProductoSchema],
		required: true,
	},
	totalProductos: {
		type: Number,
		required: true,
	},
	precioTotal: {
		type: Number,
		required: true,
	},
	fecha: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

VentaSchema.methods.toJSON = function () {
	const { __v, _id, ...venta } = this.toObject();
	venta.uid = _id;
	return venta;
};

module.exports = model('Venta', VentaSchema);
