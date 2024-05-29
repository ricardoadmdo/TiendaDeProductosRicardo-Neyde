import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import compression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		react(),
		compression(), // Agrega este plugin para habilitar la compresión de archivos
	],
});
