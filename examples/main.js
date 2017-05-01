var quill = new Quill('#editor-container', {
	modules: {
		toolbar: {
			container: '#toolbar',
			/* Insert your upload function
			handlers: {
				uploadImage: function(image, success){ }
			} */
		},
		title: {
			placeholder: {
				title: 'Titulo',
				body: 'Ingresa texto...',
			}
		},
	},
	formats: ['blockTitle', 'blockImage', 'image'],
	theme: 'cobble',
});