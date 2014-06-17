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
            this.parcels = new BP.control.Parcels('#list');
            this.parcels.element.bind('selected', can.proxy(this.editParcel, this));

        },
        editParcel: function (e, parcel) {
            this.toolbar.parcel(parcel);
        }
    });

    var main = new Main('#container');
});