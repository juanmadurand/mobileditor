import Block from 'quill/blots/block';
import Parchment from 'parchment';

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

    insertAt(index, value, def) {
      if (typeof value === 'string' && value.endsWith('\n')) {
        let block = Parchment.create(Block.blotName);
        this.parent.insertBefore(block, index === 0 ? this : this.next);
        block.insertAt(0, value.slice(0, -1));
      } else {
        super.insertAt(index, value, def);
      }
    }
}
TitleBlot.blotName = 'blockTitle';
TitleBlot.className = 'ql-blockTitle';
TitleBlot.tagName = 'h1';


export default TitleBlot;
