BP.control.Parcels = can.Control.extend({}, {
    model: BP.model.Parcel,
    init: function () {
        var el = this.element;

        this.model.findAll({}, function (parcels) {
            el.html(can.view('template/parcelList.mustache', {parcels: parcels}));
        });

    },
    '.item-action click': function (el) {
        var action;
        if (el.hasClass('action-delete')) {
            action = 'delete';
        } else if (el.hasClass('action-update')) {
            action = 'update';
        } else if (el.hasClass('action-viewed')) {
            action = 'viewed';
        }

        if (!action) {
            return;
        }
        var parcel = el.parents('div.item').data('parcel');
        this.element.trigger('selected', parcel);
        console.log(action);
    }
});