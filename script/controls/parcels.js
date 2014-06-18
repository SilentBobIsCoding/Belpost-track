BP.control.Parcels = can.Control.extend({}, {
    model: BP.model.Parcel,
    init: function () {
        var that = this;

        this.model.findAll({}, function (parcels) {
            that.element.html(can.view('template/parcelList.mustache', {parcels: parcels}));
            that.parcels = parcels;
        });

    },
    '.item-action click': function (el) {
        var parcel = el.parents('div.item').data('parcel');
        var action;
        if (el.hasClass('action-delete')) {
            this.deleteParcel(parcel);
        } else if (el.hasClass('action-update')) {
            action = 'refresh';
        } else if (el.hasClass('action-viewed')) {
            this.element.trigger('update', parcel);
        }

        console.log(action);
    },

    addParcel: function (parcel) {
        this.parcels.push(parcel);
    },

    deleteParcel: function (parcel) {
        parcel.destroy();
    }
});