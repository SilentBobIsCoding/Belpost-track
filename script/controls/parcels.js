BP.control.Parcels = can.Control.extend({}, {
    model: BP.model.Parcel,
    init: function () {
        var that = this;

        this.model.findAll({}, function (parcels) {
            that.element.html(can.view('template/parcelList.mustache', {parcels: parcels}, {
                dateFormatter: function (compute) {
                    return BP.utils.dateFormatter(compute());
                }
            }));
            that.parcels = parcels;
        });

    },
    '.item-action click': function (el, e) {
        var parcel = el.parents('div.item').data('parcel');
        var action;

        this._markParcelViewed(parcel);

        if (el.hasClass('action-delete')) {
            this.deleteParcel(parcel);
        } else if (el.hasClass('action-edit')) {
            this.element.trigger('update', parcel);
        }
        e.stopImmediatePropagation();
    },
    '.item click': function (el) {
        var parcel = el.data('parcel');
        this._markParcelViewed(parcel);
    },
    addParcel: function (parcel) {
        this.parcels.push(parcel);
    },
    deleteParcel: function (parcel) {
        parcel.destroy();
    },
    refreshAll: function () {
        return this.parcels.refreshAll();
    },
    _markParcelViewed: function (parcel) {
        if (!parcel) {
            return;
        }

        parcel.attr('isUpdated', false);
        parcel.save();

        var updated = this.parcels.getUpdated();
        BP.utils.updateMainIcon(updated);
    }
});