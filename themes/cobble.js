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
                        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                        fileInput.classList.add('ql-image');
                        fileInput.addEventListener('change', () => {
                            if (fileInput.files != null && fileInput.files[0] != null) {
                                let reader = new FileReader();
                                reader.onload = (e) => {
                                    const range = this.quill.getSelection(true);
                                    const that = this;
                                    const uploadImage = this.options.handlers.uploadImage;
                                    if (typeof uploadImage === 'function') {
                                        that.quill.insertEmbed(range.index, 'blockImage', {image: {url: e.target.result}, uploading: true}, Emitter.sources.SILENT);
                                        uploadImage(fileInput.files, function(image) {
                                            that.quill.updateContents(
                                              new Delta()
                                                .retain(range.index).delete(1)
                                                .insert({blockImage: {
                                                  image: {
                                                    url: image.url,
                                                  },
                                                  uploading: false,
                                                }}
                                            ), Emitter.sources.USER);
                                        });
                                    } else {
                                        that.quill.insertEmbed(range.index, 'blockImage', {image: {url: e.target.result}, uploading: false}, Emitter.sources.USER);
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
        let top = reference.bottom;
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
