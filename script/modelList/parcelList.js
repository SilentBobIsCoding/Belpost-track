BP.model.Parcel.List = BP.model.Parcel.List.extend({}, {
    refreshAll: function () {
        var deferred = new can.Deferred();
        var counter = this.length;

        this.each(function (parcel) {
            BP.model.Parcel.service.getTrackingData(
                parcel.attr('number'),
                function (errorCode, data) {
                    counter--;
                    if (errorCode !== BP.tracker.TrackingService.ERROR_CODES.success) {
                        return;
                    }

                    var events = data.insideTrack || data.outsideTrack;
                    var recentEvent, oldEvent;
                    if (events && events.length) {
                        recentEvent = events[events.length - 1];
                        oldEvent = parcel.attr('recentEvent');
                        if (!oldEvent || (oldEvent.eventName !== recentEvent.eventName || oldEvent.location !== recentEvent.location)) {
                            parcel.attr('recentEvent', recentEvent);
                            parcel.attr('isUpdated', true);
                            parcel.save();
                        }
                    }
                    if (counter === 0) {
                        deferred.resolve();
                    }
                },
                this
            );
        });

        return deferred;
    },
    getUpdated: function () {
        return this.filter(function(parcel) {
            return parcel.attr('isUpdated');
        });

    }
});