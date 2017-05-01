import Block from 'quill/blots/block';

class TitleBlot extends Block {
    static create(value) {
        let node = super.create(value);
        node.setAttribute("data-placeholder", "Title");
        node.setAttribute("data-label", "Title");
        node.textContent = value;
        if (!value) {
            node.classList.add('empty');
        }
        return node;
    }

    insertAt(index, value, def) { // overrides parent
    }
}
TitleBlot.blotName = 'blockTitle';
TitleBlot.className = 'ql-blockTitle';
TitleBlot.tagName = 'h1';


export default TitleBlot;
