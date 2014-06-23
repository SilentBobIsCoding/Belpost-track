BP.tracker.BackgroundWorker = can.Construct.extend({}, {
    pingInterval: 1,    // hours
    service: null,
    notificationId: 'background',
    taskId: null,
    parcels: null,

    init: function () {
        var that = this;
        this.model = BP.model.Parcel;
        this.model.findAll({}, function (parcels) {
            that.parcels = parcels;
            that.start();
        });
    },

    strings: {
        popupTitle: 'You have an update',
        popupMessage: 'Following items were updated:'
    },

    start: function() {
        this.stop();
        var interval = this.pingInterval * 1000 * 60 * 60;  // covert to hours
        this.taskId = setInterval($.proxy(this.refreshAll, this), interval);
        this.refreshAll().then($.proxy(this.onUpdateFinished, this));
    },

    stop: function() {
        if (this.taskId) {
            clearInterval(this.taskId);
            this.taskId = null;
        }
    },

    onUpdateFinished: function() {
        var updated = this.parcels.filter(function(parcel) {
            return parcel.attr('statusUpdated');
        });

        if (updated.length !== 0) {
            this.showUpdateNotification(updated);
        }
    },

    showUpdateNotification: function(parcels) {
        var list = [];
        parcels.each(function(parcel) {
            list.push({
                title: parcel.attr('description'),
                message: parcel.attr('recentEvent').eventName
            });
        });

        var strings = this.strings;

        var params = {
            type: 'list',
            iconUrl: ' images/icon.png',
            title: strings.popupTitle,
            message: strings.popupMessage,
            items: list
        };

        chrome.notifications.create(this.notificationId, params, this.emptyFn);
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
                    var recentEvent, oldEvent;
                    if (events && events.length) {
                        recentEvent = events[events.length - 1];
                        oldEvent = parcel.attr('recentEvent');
                        if (!oldEvent || (oldEvent.eventName !== recentEvent.eventName || oldEvent.location !== recentEvent.location)) {
                            parcel.attr('recentEvent', recentEvent);
                            parcel.attr('statusUpdated', true);
                            parcel.save();
                        } else {
                            parcel.attr('statusUpdated', false);
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

    onNotificationClick: function(id) {
    },

    emptyFn: function() {}
}, {});

$(function () {
    (new BP.tracker.BackgroundWorker());
});