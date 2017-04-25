import Quill from 'quill/core';

import Header from 'quill/formats/header';
import Link from 'quill/formats/link';

import Image from 'quill/formats/image';
import Toolbar from 'quill/modules/toolbar';

import Icons from 'quill/ui/icons';
import Picker from 'quill/ui/picker';
import ColorPicker from 'quill/ui/color-picker';
import IconPicker from 'quill/ui/icon-picker';
import Tooltip from 'quill/ui/tooltip';

import SnowTheme from 'quill/themes/snow';


Quill.register({
  'formats/header': Header,
  'formats/link': Link,
  'formats/image': Image,

  'modules/toolbar': Toolbar,

  'themes/snow': SnowTheme,
}, true);


module.exports = Quill;