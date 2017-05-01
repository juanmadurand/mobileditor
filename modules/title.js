import TitleBlot from '../formats/title';
import Delta from 'quill-delta';
import Quill from 'quill/core/quill';
import Module from 'quill/core/module';
import Keyboard from 'quill/modules/keyboard';
import Block, { BlockEmbed } from 'quill/blots/block';

class Title extends Module {
    constructor(quill, options) {
        super(quill, options);
        this.quill.on(Quill.events.TEXT_CHANGE, (type, range) => {
            this.change(options);
        });

        this.change(options);
    }

    change(options) {
        this.checkRequiredTitle();
        this.updatePlaceholders(options);
    }

    checkRequiredTitle() {
        let lines = this.quill.scroll.lines();
        let first = lines[0];
        if (first instanceof Block) {
            this.quill.insertEmbed(0, 'blockTitle', '', Quill.sources.SILENT);
        }
        if (lines.length === 1) {
            this.quill.updateContents(new Delta().retain(1).insert({block: 'a'}));
        }
    }

    updatePlaceholders(options) {
        const lines = this.quill.scroll.lines();

        lines.forEach((block, index) => {
            const node = block.domNode;
            if (block instanceof TitleBlot) {
                node.classList.toggle('empty', node.textContent === '');
                node.setAttribute('data-placeholder', options.placeholder.title || 'Title');
            } else if (index === 1 && lines.length === 2) {
                const isEmpty = node.textContent === '' && node.childNodes[0].tagName === 'BR';
                node.classList.toggle('empty', isEmpty);
                node.setAttribute('data-placeholder', options.placeholder.body || 'Compose...');
            } else {
                node.classList.remove('empty');
                node.removeAttribute('data-placeholder');
            }
        });
    }

    static register() {
        Quill.register(TitleBlot, true);
    }
}


export { TitleBlot, Title as default };
