var quill = new Quill('#editor-container', {
	modules: {
		toolbar: {
			container: '#toolbar',
			/* Insert your upload function
			handlers: {
				uploadImage: function(image, success){ }
			} */
		},
		/* // Enable title module
		title: {
			placeholder: {
				title: 'Title',
				body: 'Write something...',
			}
		},
		*/
	},
	formats: ['blockTitle', 'blockImage', 'image'],
	theme: 'cobble',
});
