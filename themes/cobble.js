import extend from 'extend';
import Delta from 'quill-delta';
import Parchment from 'parchment';
import Emitter from 'quill/core/emitter';
import Keyboard from 'quill/modules/keyboard';
import BaseTheme from 'quill/themes/base';
import BlockImage from '../formats/blockImage';
import icons from '../assets/icons';
import Tooltip from 'quill/ui/tooltip';

class CobbleTheme extends BaseTheme {
    constructor(quill, options) {
        super(quill, options);
        this.quill.container.classList.add('ql-cobble');
    }

    extendToolbar(toolbar) {
        this.tooltip = new CobbleTooltip(this.quill, this.options.bounds);
        this.tooltip.root.appendChild(toolbar.container);
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
                        fileInput.setAttribute('multiple', 'multiple');
                        fileInput.setAttribute('accept', 'image/*');
                        fileInput.classList.add('ql-image');
                        fileInput.addEventListener('change', () => {
                            if (fileInput.files == null || fileInput.files.length === 0) {
                                return;
                            }

                            const files = [...fileInput.files];
                            let reader = new FileReader();
                            reader.onload = (e) => {
                                const range = this.quill.getSelection(true);
                                const that = this;
                                const uploadImage = this.options.handlers.uploadImage;
                                if (typeof uploadImage === 'function') {
                                    that.quill.insertEmbed(range.index, 'blockImage', {
                                      image: e.target.result,
                                      uploading: true,
                                      cancelUpload: this.options.handlers.cancelUpload,
                                    }, Emitter.sources.SILENT);
                                    uploadImage([reader.currentFile], {
                                        start: function() {},
                                        progress: function(value) {
                                            let [blockImage, ] = that.quill.getLine(range.index);
                                            blockImage.progress(value);
                                        },
                                        success: function(image) {
                                            that.quill.updateContents(
                                              new Delta()
                                                .retain(range.index).delete(1)
                                                .insert({blockImage: {
                                                  image: image.url,
                                                  uploading: false,
                                                }}
                                            ), Emitter.sources.USER);
                                        },
                                    });
                                } else {
                                    that.quill.insertEmbed(range.index, 'blockImage', {image: e.target.result, uploading: false}, Emitter.sources.USER);
                                }

                                // Handle files
                                if (files.length > 0) {
                                    reader.currentFile = files.shift();
                                    reader.readAsDataURL(reader.currentFile);
                                } else {
                                    fileInput.value = "";
                                }
                            }
                            reader.currentFile = files.shift();
                            reader.readAsDataURL(reader.currentFile);
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

class CobbleTooltip extends Tooltip {
    constructor(quill, bounds) {
        super(quill, bounds);
        this.listen();
        this.quill.on(Emitter.events.EDITOR_CHANGE, (type, ...args) => {
            if (type !== Emitter.events.SELECTION_CHANGE) return;

            const [range, oldRange, source] = args;
            if (range == null) {
                return;
            }

            let [line, linePosition] = this.quill.getLine(range.index);
            if (line && linePosition === 0) {
                this.show();

                this.root.style.left = '0px';
                this.root.style.width = '';
                this.root.style.width = this.root.offsetWidth + 'px';
                this.position(this.quill.getBounds(range));
            } else if (document.activeElement !== this.textbox && this.quill.hasFocus()) {
                this.hide();
            }
        });
    }

    listen() {
      this.quill.on(Emitter.events.SCROLL_OPTIMIZE, () => {
        // Let selection be restored by toolbar handlers before repositioning
        this.update();
      });
    }

    update() {
      clearTimeout(window.tooltipTimer);
      window.tooltipTimer = setTimeout(() => {
        if (this.root.classList.contains('ql-hidden')) return;
        let range = this.quill.getSelection();
        if (range != null) {
          this.position(this.quill.getBounds(range));
        }
      }, 100);
    }

    position(reference) {
        let left = reference.left + reference.width;
        let top = reference.bottom + this.quill.root.scrollTop;
        this.root.style.left = left + 'px';
        this.root.style.top = top + 'px';
    }
}
CobbleTooltip.TEMPLATE = [
'<div class="ql-tooltip-editor">',
'<a class="ql-close"></a>',
'</div>'
].join('');


export { CobbleTooltip, CobbleTheme as default };
