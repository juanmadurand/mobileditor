import Block, {BlockEmbed} from 'quill/blots/block';
import icons from '../assets/icons';

class BlockImage extends BlockEmbed {
    static create(data) {
        let node = super.create(data.image);
        node.classList.toggle('uploading', data.uploading === true);
        if (data.image) {
            node.appendChild(this.getImgNode(data.image));
            node.appendChild(this.getCloseBtn(data.cancelUpload));
            node.appendChild(this.getProgressBar());
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

    static getCloseBtn(cancelUpload) {
        const button = document.createElement("button");
        button.classList.add('ql-close-img');
        button.onclick = function() {
            typeof cancelUpload === 'function' && cancelUpload();
            this.parentElement.remove();
        }
        button.innerHTML = icons.close;
        return button;
    }

    static getProgressBar() {
        const domProgress = document.createElement("div");
        const domProgressBar = document.createElement("div");

        domProgress.classList.add("file_progress");
        domProgressBar.classList.add("file_progress_bar");

        domProgress.appendChild(domProgressBar);

        return domProgress;
    }

    progress(percentage) {
        const progressBar = this.domNode.querySelector('.file_progress_bar')
        progressBar.style.width = percentage + "%";
    }
}

BlockImage.blotName = 'blockImage';
BlockImage.className = 'ql-blockImage';
BlockImage.tagName = 'div';


export default BlockImage;
