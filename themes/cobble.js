import BaseTheme from 'quill/themes/base';
import icons from 'quill/ui/icons';
import extend from 'extend';
import Delta from 'quill-delta';
import Emitter from 'quill/core/emitter';
import Keyboard from 'quill/modules/keyboard';
import { BlockEmbed } from 'quill/blots/block';
import BlockImage from '../formats/blockImage';
import Parchment from 'parchment';

class CobbleTheme extends BaseTheme {
    constructor(quill, options) {
        super(quill, options);
        this.quill.container.classList.add('ql-cobble');

        this.quill.root.addEventListener('click', (ev) => { // Select block
            let node = ev.target;
            if (ev.target.tagName === 'IMG') {
                node = node.parentElement;
            }
            let image = Parchment.find(node);

            if (image instanceof BlockImage) {
            this.quill.setSelection(image.offset(this.quill.scroll), 1, 'user');
            }
        });
    }

    extendToolbar(toolbar) {
        toolbar.container.classList.add('ql-cobble');
        this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons);
        this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons);
    }

}

CobbleTheme.DEFAULTS = extend(true, {}, CobbleTheme.DEFAULTS, {
    modules: {
        toolbar: {
            handlers: {
                image: function() {
                    let fileInput = this.container.querySelector('input.ql-image[type=file]');
                    if (fileInput == null) {
                        fileInput = document.createElement('input');
                        fileInput.setAttribute('type', 'file');
                        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                        fileInput.classList.add('ql-image');
                        fileInput.addEventListener('change', () => {
                            if (fileInput.files != null && fileInput.files[0] != null) {
                                let reader = new FileReader();
                                reader.onload = (e) => {
                                    const range = this.quill.getSelection(true);
                                    const thisQuill = this.quill;
                                    const uploadImage = this.options.handlers.uploadImage;
                                    if (typeof uploadImage === 'function') {
                                        thisQuill.insertEmbed(range.index, 'blockImage', {image: e.target.result, uploading: true}, Emitter.sources.SILENT);
                                        uploadImage(fileInput.files, function(image) {
                                            thisQuill.updateContents(new Delta()
                                                .retain(range.index)
                                                .delete(1)
                                                , Emitter.sources.USER);
                                            thisQuill.insertEmbed(range.index, 'blockImage', {image: image.url, uploading: false}, Emitter.sources.USER);
                                        });
                                    } else {
                                        thisQuill.insertEmbed(range.index, 'blockImage', {image: e.target.result, uploading: false}, Emitter.sources.USER);
                                    }
                                    fileInput.value = "";
                                }
                                reader.readAsDataURL(fileInput.files[0]);
                            }
                        });
                        this.container.appendChild(fileInput);
                    }
                    fileInput.click();
                },
            }
        },
        keyboard: {
            bindings: {
                tab: {
                    key: Keyboard.keys.TAB,
                    handler: function() {
                        return true;
                    }
                },
            }
        }
    }
});

export default CobbleTheme;
