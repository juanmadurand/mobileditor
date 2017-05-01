import Quill from 'quill/core';

import Header from 'quill/formats/header';
import Link from 'quill/formats/link';

import Image from 'quill/formats/image';

import Icons from 'quill/ui/icons';
import Picker from 'quill/ui/picker';
import IconPicker from 'quill/ui/icon-picker';
import Tooltip from 'quill/ui/tooltip';
import Toolbar from 'quill/modules/toolbar';
import Keyboard from 'quill/modules/keyboard';


// Custom
import Title from './modules/title';
import CobbleTheme from './themes/cobble';
import BlockImage from './formats/blockImage';



Quill.register({
    'formats/header': Header,
    'formats/link': Link,
    'formats/image': Image,
    'formats/blockImage': BlockImage,

    'modules/keyboard': Keyboard,
    'modules/toolbar': Toolbar,
    'modules/title': Title,

    'themes/cobble': CobbleTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/icon-picker': IconPicker,
    'ui/tooltip': Tooltip
}, true);


module.exports = Quill;
