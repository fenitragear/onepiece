// Our dialog definition.
CKEDITOR.dialog.add('abbrDialog', function(editor) {
    return {

        // Basic properties of the dialog window: title, minimum size.
        title: 'TAGS',
        minWidth: 250,
        minHeight: 150,

        // Dialog window content definition.
        contents: [{
            // Definition of the Basic Settings dialog tab (page).
            id: 'tab-basic',
            label: 'Basic',

            // The tab content.
            elements: [{
                    // Text input field for the abbreviation text.
                    type: 'select',
                    id: 'abbr',
                    label: 'Tag',
                    items: editor.tags,
                    'default': editor.tags[0][1],

                    // Validation checking whether the field is not empty.
                    validate: CKEDITOR.dialog.validate.notEmpty("Veuillez choisir un tag."),

                    // Called by the main setupContent method call on dialog initialization.
                    setup: function(element) {
                        this.setValue(element.getText());
                    },

                    // Called by the main commitContent method call on dialog confirmation.
                    commit: function(element) {
                        element.setText(this.getValue());
                    },

                    onChange: function(element) {
                        var value = element.data.value.replace(new RegExp("\\[record\\]", 'g'), "");
                        value = value.replace(new RegExp("\\$\\$", 'g'), "");
                        var apercus = $('div.apercu');
                        for (var index = 0; index < apercus.length; index++) {
                            var element = apercus[index];
                            element.innerHTML = editor.tagsObject[value];
                        }
                    }
                },
                {
                    type: 'html',
                    html: '<pre><div class="apercu"></div></pre>',
                    label: 'Aperçu',
                    onShow: function() {
                        var currentPage = document.getElementById("currentPage").textContent;
                        $.getJSON("../server/files/listrecipient" + currentPage + ".json", function(data) {
                            editor.tags = [];
                            editor.tagsObject = {};
                            data.record.forEach(function(element) {
                                editor.tags.push([element.name, '$$[record]' + element.name + '$$']);
                                editor.tagsObject[element.name] = element.value;
                            }, this);
                            var first = editor.tags[0][0];
                            var apercus = $('div.apercu');
                            for (var index = 0; index < apercus.length; index++) {
                                var element = apercus[index];
                                element.innerHTML = editor.tagsObject[first];
                            }
                        });
                    }
                }
            ]
        }],

        // Invoked when the dialog is loaded.
        onShow: function() {

            // Get the selection from the editor.
            var selection = editor.getSelection();

            // Get the element at the start of the selection.
            var element = selection.getStartElement();

            // Get the <abbr> element closest to the selection, if it exists.
            if (element)
                element = element.getAscendant('abbr', true);

            // Create a new <abbr> element if it does not exist.
            if (!element || element.getName() != 'abbr') {
                element = editor.document.createElement('abbr');

                // Flag the insertion mode for later use.
                this.insertMode = true;
            } else
                this.insertMode = false;

            // Store the reference to the <abbr> element in an internal property, for later use.
            this.element = element;

            // Invoke the setup methods of all dialog window elements, so they can load the element attributes.
            if (!this.insertMode)
                this.setupContent(this.element);
        },

        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function() {

            // The context of this function is the dialog object itself.
            // http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
            var dialog = this;

            // Create a new <abbr> element.
            var abbr = this.element;

            // Invoke the commit methods of all dialog window elements, so the <abbr> element gets modified.
            this.commitContent(abbr);

            // Finally, if in insert mode, insert the element into the editor at the caret position.
            if (this.insertMode)
                editor.insertElement(abbr);
        }
    };
});