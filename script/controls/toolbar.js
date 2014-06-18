BP.control.Toolbar = can.Control.extend({}, {
    editor: null,
    editing: null,  // currently editing model data backup

    init: function (el) {
        var that = this;
        can.view('template/toolbar.mustache', {}, function (frag) {
            el.html(frag);

            var editor = el.find('.add-new-track-panel');
            that.number = editor.find('.parcel-number');
            that.description = editor.find('.parcel-description');
            that.editor = editor;
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
    '.add-track click': function () {

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
        this.options.parcel.save();
    },

    cancelEdit: function () {
        var parcel = this.options.parcel;
        parcel.attr('number',this.editing.number);
        parcel.attr('description', this.editing.description);
        this.editor.hide();
    }

});