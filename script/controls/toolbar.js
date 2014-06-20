BP.control.Toolbar = can.Control.extend({}, {
    editor: null,
    editing: null,  // currently editing model data backup

    init: function (el) {
        var that = this;
        can.view('template/toolbar.mustache', {}, function (frag) {
            el.html(frag);

            var editor = el.find('.editor-panel');
            that.number = editor.find('.parcel-number');
            that.description = editor.find('.parcel-description');
            that.editor = editor;
            that.setEditActions(false);
        });
    },

    parcel: function (parcel) {
        this.options.parcel = parcel;
        this.editing = can.extend({}, parcel._data);
        this.on();
        this.setValues();
        this.editor.show();
    },

    setValues: function () {
        var parcel = this.options.parcel;
        this.number.val(parcel.number);
        this.description.val(parcel.description);
    },
    '.add-parcel click': function () {
        if (this.editing) {
            return;
        }

        this.setEditActions(true);

        var parcel = new BP.model.Parcel({
            number: '',
            description: ''
        });
        var that = this;
        parcel.bind('created', function () {
            that.element.trigger('add', parcel);
        });
        this.parcel(parcel);
    },
    '.refresh-parcels click': function () {
        this.element.trigger('refresh');
    },
    '.submit-parcel click': function () {
        this.submitEdit(false);
    },
    '.cancel-parcel click': function () {
        this.submitEdit(false);
    },
    'input change': function () {
        var parcel = this.options.parcel;
        parcel.attr('number', this.number.val());
        parcel.attr('description', this.description.val());
    },
    'input keyup': function (el, ev) {
        switch (ev.keyCode) {
            case 27:    // ESCAPE
                this.cancelEdit();
                break;
            case 13:    // ENTER
                this.submitEdit();
                break;
        }
    },

    submitEdit: function () {
        if (!this.options.parcel.isValid()) {
            this.cancelEdit();
            return;
        }
        this.editor.hide();
        this.options.parcel.save();
        this.setEditActions(false);
        delete this.editing;
    },

    cancelEdit: function () {
        this.setEditActions(false);
        var parcel = this.options.parcel;
        this.editor.hide();

        if (parcel.isNew()) {
            parcel.destroy();
        } else {
            parcel.attr('number',this.editing.number);
            parcel.attr('description', this.editing.description);
        }
        delete this.editing;
    },

    setLoadingMask: function (maskVisible) {
        var mask = this.element.find('.loading-indicator');
        var refreshButton = this.element.find('.refresh-parcels');
        if (maskVisible) {
            refreshButton.hide();
            mask.show();
        } else {
            mask.hide();
            refreshButton.show();
        }
    },
    setEditActions: function (editActive) {
        this.element.find('.toolbar-button').hide();
        this.element.find(editActive ? '.submit-parcel, .cancel-parcel' : '.refresh-parcels, .add-parcel').show();
    }
});