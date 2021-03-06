/**
 * Created by azhukouski on 6/16/2014.
 */

$(function () {
    var Main = can.Control.extend({}, {
        model: BP.model.Parcel,
        init: function (el) {
            this.toolbar = new BP.control.Toolbar('#header');
            this.toolbar.element.bind('add', can.proxy(this.addParcel, this));
            this.toolbar.element.bind('refresh', can.proxy(this.refreshAll, this));
            this.parcels = new BP.control.Parcels('#list');
            this.parcels.element.bind('update', can.proxy(this.editParcel, this));

        },
        addParcel: function (e, parcel) {
            this.parcels.addParcel(parcel);
        },
        editParcel: function (e, parcel) {
            this.toolbar.parcel(parcel);
        },
        refreshAll: function () {
            var toolbar = this.toolbar;
            toolbar.setLoadingMask(true);
            this.parcels.refreshAll().then(function () {
                toolbar.setLoadingMask(false);
            });
        }
    });

    var main = new Main('#container');
});