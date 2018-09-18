/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'fr';
    config.contentsCss = [CKEDITOR.getUrl('contents.css'), CKEDITOR.getUrl('fonts.css')]
    config.font_names = 'Arial Bold;Arial Rounded Bold;Calibri;Century Gothic;Comic Sans MS;Courier New;Helvetica;Helvetica Narrow;Helvetica Black;Helvetica Light;Impact;Neuropol;Palatino Roman;Tahoma;Take Cover;Times New Roman;Verdana';
    config.extraPlugins = 'divarea,tags,simplebutton';
    config.language = 'fr';
    config.resize_enabled = false;
    config.title = false;
    config.toolbarGroups = [
        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
        {name: 'forms', groups: ['forms']},
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        '/',
        {name: 'links', groups: ['links']},
        {name: 'styles', groups: ['styles']},
        {name: 'colors', groups: ['colors']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'insert', groups: ['insert']},
        {name: 'tools', groups: ['tools']},
        {name: 'others', groups: ['others']},
        {name: 'about', groups: ['about']}
    ];
    // config.removeButtons = 'Glyphicons,Save,Templates,NewPage,Preview,Print,Copy,Cut,Paste,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CreateDiv,Blockquote,Language,Anchor,Image,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Maximize,ShowBlocks,About,Styles,Format';
    config.removeButtons = 'Glyphicons,Save,Templates,NewPage,Preview,Print,Copy,Cut,Paste,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CreateDiv,Blockquote,Language,Anchor,Image,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Maximize,ShowBlocks,About,Format';
    config.allowedContent = true;
};
