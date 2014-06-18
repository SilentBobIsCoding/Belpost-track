/**
 * Created by azhukouski on 6/16/2014.
 */
window.BP = {
    model: {},
    control: {}
};

$(function () {

    var Main = can.Control.extend({}, {
        model: BP.model.Parcel,
        init: function (el) {
            this.toolbar = new BP.control.Toolbar('#header');
            this.toolbar.element.bind('add', can.proxy(this.addParcel, this));
            this.parcels = new BP.control.Parcels('#list');
            this.parcels.element.bind('update', can.proxy(this.editParcel, this));

        },
        addParcel: function (e, parcel) {
            this.parcels.addParcel(parcel);
        },
        editParcel: function (e, parcel) {
            this.toolbar.parcel(parcel);
        }
    });

    var main = new Main('#container');
});