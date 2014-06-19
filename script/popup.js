/**
 * Created by azhukouski on 6/16/2014.
 */
window.BP = {
    model: {},
    control: {},
    tracker: {}
};

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
            this.parcels.refreshAll();
        }
    });

    var main = new Main('#container');
});