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
    '.item-action click': function (el) {
        var parcel = el.parents('div.item').data('parcel');
        var action;
        if (el.hasClass('action-delete')) {
            this.deleteParcel(parcel);
        } else if (el.hasClass('action-edit')) {
            this.element.trigger('update', parcel);
        }
    },

    addParcel: function (parcel) {
        this.parcels.push(parcel);
    },

    deleteParcel: function (parcel) {
        parcel.destroy();
    },
    refreshAll: function () {
        var deferred = new can.Deferred();
        var counter = this.parcels.length;

        this.parcels.each(function (parcel) {
            BP.model.Parcel.service.getTrackingData(
                parcel.attr('number'),
                function (errorCode, data) {
                    counter--;
                    if (errorCode !== BP.tracker.TrackingService.ERROR_CODES.success) {
                        return;
                    }


                    var events = data.insideTrack || data.outsideTrack;
                    var recentEvent;
                    if (events && events.length) {
                        recentEvent = events[events.length - 1];
                        parcel.attr('recentEvent', recentEvent);
                        parcel.save();
                    }
                    if (counter === 0) {
                        deferred.resolve();
                    }
                },
                this
            );
        });

        return deferred;
    }
});