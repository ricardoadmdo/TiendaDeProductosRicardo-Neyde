import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faCamera } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import axios from 'axios';

const cloudName = 'dber1pxea';
const uploadPreset = 'ml_default';

const TablaCRUD = ({
	searchTerm,
	handleSearchChange,
	handleSearchSubmit,
	busqueda,
	data,
	onAdd,
	columns,
	onEdit,
	onDelete,
	title,
	modalTitle,
	validate,
	operationMode,
	setOperationMode,
	formFields,
	formState,
	setFormState,
}) => {
	const [uploading, setUploading] = useState(false);
	const [url, setUrl] = useState('');
	const [imageName, setImageName] = useState('');

	const handleDrop = useCallback(
		async (acceptedFiles) => {
			setUploading(true);
			const file = acceptedFiles[0];

			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', uploadPreset);

			try {
				const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
				const url = response.data.secure_url;
				setUrl(url);
				setImageName(file.name);
				setFormState((prevState) => ({ ...prevState, url }));
			} catch (error) {
				console.error('Error uploading image:', error);
			} finally {
				setUploading(false);
			}
		},
		[setFormState]
	);

	const { getRootProps, getInputProps, open } = useDropzone({
		noClick: true,
		noKeyboard: true,
		onDrop: handleDrop,
	});

	// Funciones para manejar eventos generales
	const handleAdd = () => {
		setFormState({
			nombre: '',
			password: '',
			correo: '',
			rol: '',
			url: '',
		});
		setOperationMode(1); // Modo 'crear'
		onAdd();
	};

	const handleEdit = (item) => {
		setFormState({
			nombre: item.nombre,
			password: '',
			correo: item.correo,
			rol: item.rol,
			url: item.url,
		});
		setOperationMode(2); // Modo 'editar'
		onEdit(item);
	};

	const handleDelete = (item) => onDelete(item);

	const handleChange = (name, value) => {
		setFormState((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className='container-fluid'>
			<div className='row mt-3'>
				<div className='col-md-4 offset-md-4'>
					<div className='d-grid mx-auto'>
						<button onClick={handleAdd} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modal'>
							<i className='fa-solid fa-circle-plus'></i> {modalTitle}
						</button>
					</div>
				</div>
			</div>

			{busqueda && (
				<form className='d-flex me-auto mb-2 mb-lg-0' onSubmit={handleSearchSubmit}>
					<input
						type='search'
						name='searchInput'
						className='form me-1'
						placeholder='Buscar usuarios...'
						aria-label='Buscar'
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<button className='btn btn-outline-dark' type='submit'>
						<FontAwesomeIcon color='black' icon={faSearch} />
					</button>
				</form>
			)}

			<div className='row mt-3 animate__animated animate__fadeIn'>
				<div className='card-body'>
					<div className='table-responsive'>
						<table className='table table-bordered'>
							<thead>
								<tr>
									{columns.map((column, index) => (
										<th key={index}>{column.header}</th>
									))}
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{data.map((item) => (
									<tr key={item.uid}>
										{columns.map((column) => (
											<td key={column.accessor}>
												{column.accessor === 'estado'
													? item[column.accessor]
														? 'Activo'
														: 'Inactivo'
													: item[column.accessor]}
											</td>
										))}
										<td>
											<button
												type='button'
												onClick={() => handleEdit(item)}
												className='btn btn-warning'
												data-bs-toggle='modal'
												data-bs-target='#modal'
											>
												<FontAwesomeIcon icon={faEdit} /> Editar
											</button>
											<span style={{ marginRight: '0px' }}></span>
											<button type='button' onClick={() => handleDelete(item)} className='btn btn-danger'>
												<FontAwesomeIcon icon={faTrash} /> Eliminar
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className='modal fade animate__animated animate__fadeIn' id='modal' aria-hidden='true' aria-labelledby='exampleModalToggleLabel'>
				<div className='modal-dialog modal-dialog-centered'>
					<div className='modal-content'>
						<div className='modal-header'>
							<label className='modal-title h5'>{title}</label>
							<button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
						</div>
						<div className='modal-body'>
							<input type='hidden' id='id'></input>
							<form id='Form' onSubmit={(event) => validate(event, formState)}>
								{formFields.map((field) => {
									if (field.name === 'password' && operationMode === 2) {
										return null;
									}
									if (field.name === 'estado' && operationMode === 1) {
										return null;
									}
									if (field.type === 'select') {
										if (field.name === 'estado' && operationMode === 2) {
											return (
												<div className='input-group mb-3' key={field.name}>
													<span className='input-group-text'>{field.label}:</span>
													<select
														defaultValue='Inactivo'
														className='form-control'
														onChange={(event) => handleChange(field.name, event.target.value === 'Activo')}
													>
														<option value='Inactivo'>Inactivo</option>
														<option value='Activo'>Activo</option>
													</select>
												</div>
											);
										}

										return (
											<div className='input-group mb-3' key={field.name}>
												<span className='input-group-text'>{field.label}:</span>
												<select
													defaultValue={formState[field.name]}
													className='form-control'
													onChange={(event) => handleChange(field.name, event.target.value)}
												>
													{field.options.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
											</div>
										);
									}
									if (field.name === 'url') {
										return (
											<div key={field.name} className='input-control mb-3 dropzone-area bg-light' {...getRootProps()}>
												<input {...getInputProps()} className='form-control' />
												<div className='input-group-append'>
													<div className='dropzone-content border w-100 d-flex justify-content-between align-items-center p-2'>
														{url ? (
															<>
																<img
																	src={url}
																	alt={imageName}
																	className='img-thumbnail'
																	style={{ maxHeight: '200px' }}
																/>
																<p className='mb-0'>{imageName}</p>
															</>
														) : (
															<div className='w-100 text-center'>
																<FontAwesomeIcon icon={faCamera} size='lg' />
																<p className='mb-0'>Arrastra una imagen aquí</p>
																<button
																	type='button'
																	onClick={(e) => {
																		e.stopPropagation();
																		open();
																	}}
																	className='btn btn-dark w-100 mt-2'
																>
																	Buscar imagen
																</button>
															</div>
														)}
													</div>
												</div>
											</div>
										);
									}

									return (
										<div className='input-group mb-3' key={field.name}>
											<span className='input-group-text'>{field.label}:</span>
											<input
												type={field.type}
												id={field.name}
												className='form-control'
												placeholder={field.placeholder}
												value={formState[field.name]}
												onChange={(event) => handleChange(field.name, event.target.value)}
											/>
										</div>
									);
								})}
								{uploading && <p>Subiendo imagen...</p>}
								<div className='d-grid col-6 mx-auto'>
									<button type='submit' className='btn btn-success'>
										<i className='fa fa-floppy-disk'></i> Guardar
									</button>
								</div>
							</form>
							<div className='modal-footer'>
								<button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
									<i className='fa fa-times'></i> Cerrar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

TablaCRUD.propTypes = {
	data: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			header: PropTypes.string.isRequired,
			accessor: PropTypes.string.isRequired,
		})
	).isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	modalTitle: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	validate: PropTypes.func.isRequired,
	operationMode: PropTypes.number.isRequired,
	setOperationMode: PropTypes.func.isRequired,
	formFields: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			placeholder: PropTypes.string,
			type: PropTypes.string,
		})
	).isRequired,
	formState: PropTypes.shape({
		estado: PropTypes.bool,
	}),
	setFormState: PropTypes.func.isRequired,
	busqueda: PropTypes.bool.isRequired,
	searchTerm: PropTypes.string,
	handleSearchChange: PropTypes.func,
	handleSearchSubmit: PropTypes.func,
	url: PropTypes.func,
};

export default TablaCRUD;
