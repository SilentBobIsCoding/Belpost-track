BP.control.Toolbar = can.Control.extend({}, {
    editor: null,

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
        this.on();
        this.setValues();
        this.editor.show();
    },

    setValues: function () {
        var parcel = this.options.parcel;
        this.number.val(parcel.number);
        this.description.val(parcel.description);
    },

    'input change': function () {
        var parcel = this.options.parcel;
        parcel.attr('number', this.number.val());
        parcel.attr('description', this.description.val());

    }
});