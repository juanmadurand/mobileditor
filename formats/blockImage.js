import Block, {BlockEmbed} from 'quill/blots/block';

class BlockImage extends BlockEmbed {
    static create(data) {
        let node = super.create(data.image);
        node.classList.toggle('uploading', data.uploading === true);
        if (data.image) {
            node.appendChild(this.getImgNode(data.image));
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
        var image = document.createElement("img");
        image.setAttribute("src", url);
        image.onload = function() {
          typeof onload === 'function' && onload();
        }
        return image;
    }
}

BlockImage.blotName = 'blockImage';
BlockImage.className = 'ql-blockImage';
BlockImage.tagName = 'div';


export default BlockImage;
