// Register the plugin within the editor.
CKEDITOR.plugins.add( 'tags', {

	// Register the icons.
	icons: 'abbr',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog window.
		editor.addCommand( 'abbr', new CKEDITOR.dialogCommand( 'abbrDialog', {

			// Allow the abbr tag with an optional title attribute.
			allowedContent: 'abbr[title,id]',

			// Require the abbr tag to be allowed for the feature to work.
			requiredContent: 'abbr',

			// Prefer abbr over acronym. Transform acronym elements into abbr elements.
			contentForms: [
				'abbr',
				'acronym'
			]
		} ) );

		// Create a toolbar button that executes the above command.
		// editor.ui.addButton( 'Abbr', {

		// 	// The text part of the button (if available) and the tooltip.
		// 	label: 'Insérer Tag',

		// 	// The command to execute on click.
		// 	command: 'abbr',

		// 	// The button placement in the toolbar (toolbar group name).
		// 	toolbar: 'insert'
		// });

		var placeholders = [];
		for (var i = 0; i < 9; i++) {
			placeholders.push(['a', 'b', 'c']);
		}

		// add the menu to the editor
		editor.ui.addRichCombo('placeholder_select',
		{
			label: 		'Personnalisation',
			title: 		'Personnalisation',
			voiceLabel: 'Personnalisation',
			className: 	'cke_format',
			multiSelect:false,
			panel:
			{
				css: [].concat(editor.config.contentsCss).concat(CKEDITOR.skin.getPath('editor')),
				voiceLabel: editor.lang.panelVoiceLabel
			},

			init: function()
			{
				this.startGroup( "Personnalisation" );
				for (var i in editor.tags)
				{
					this.add(editor.tags[i][1], editor.tags[i][0], editor.tags[i][0]);
				}
			},

			onClick: function( value )
			{
				editor.focus();
				editor.fire( 'saveSnapshot' );
				editor.insertHtml(value);
				editor.fire( 'saveSnapshot' );
			}
		});

		if ( editor.contextMenu ) {
			
			// Add a context menu group with the Edit Abbreviation item.
			editor.addMenuGroup( 'abbrGroup' );
			editor.addMenuItem( 'abbrItem', {
				label: 'Modifier Tag',
				icon: this.path + 'icons/abbr.png',
				command: 'abbr',
				group: 'abbrGroup'
			});

			editor.contextMenu.addListener( function( element ) {
				if ( element.getAscendant( 'abbr', true ) ) {
					return { abbrItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}

		// Register our dialog file -- this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'abbrDialog', this.path + 'dialogs/abbr.js' );
		var urlArray = window.location.hash.split('/');
        var clientId = urlArray[3];
		$.getJSON('../server/files/'+clientId+'/config.json', function (config) {
            var urlTag = config.tagUrl;
			urlTag = urlTag.replace(new RegExp("\\[NREC\\]", 'g'), 1);
			urlTag = urlTag.replace(new RegExp("\\[OPEKEY\\]", 'g'), clientId);
            $.getJSON(urlTag, function(data) {
				editor.tags = [];
				editor.tagsObject = {};
				if (data.record){
					data.record.forEach(function(element) {
						editor.tags.push([element.name, '$$[record]'+element.name+'$$']);
						editor.tagsObject[element.name] = element.value;
					}, this);
				}
			});
        }).fail(function() {
			$.getJSON('../server/service/default-config.json', function (config) {
				var urlTag = config.tagUrl;
				urlTag = urlTag.replace(new RegExp("\\[OPEKEY\\]", 'g'), clientId);
				urlTag = urlTag.replace(new RegExp("\\[NREC\\]", 'g'), 1);
				$.getJSON(urlTag, function(data) {
					editor.tags = [];
					editor.tagsObject = {};
					data.record.forEach(function(element) {
						editor.tags.push([element.name, '$$[record]'+element.name+'$$']);
						editor.tagsObject[element.name] = element.value;
					}, this);
				});
			})
		});
	}
});
