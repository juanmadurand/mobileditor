import Block, {BlockEmbed} from 'quill/blots/block';
import icons from '../assets/icons';

class BlockImage extends BlockEmbed {
    static create(data) {
        let node = super.create(data.image);
        node.classList.toggle('uploading', data.uploading === true);
        if (data.image) {
            node.appendChild(this.getImgNode(data.image));
            node.appendChild(this.getCloseBtn());
        }
        return node;
    }

    static sanitize(url) {
        return url;
    }

    static value(domNode) {
        return {
            image: domNode.querySelector('img').getAttribute('src')
        };
    }

    static getImgNode({url, onload}) {
        const image = document.createElement("img");
        image.setAttribute("src", url);
        image.onload = function() {
          typeof onload === 'function' && onload();
        }
        return image;
    }

    static getCloseBtn() {
        const button = document.createElement("button");
        button.classList.add('ql-close-img');
        button.onclick = function() {
            this.parentElement.remove();
        }
        button.innerHTML = icons.close;
        return button;
    }
}

BlockImage.blotName = 'blockImage';
BlockImage.className = 'ql-blockImage';
BlockImage.tagName = 'div';


export default BlockImage;
