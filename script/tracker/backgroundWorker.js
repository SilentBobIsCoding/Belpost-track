BP.tracker.BackgroundWorker = can.Construct.extend({}, {
    pingInterval: 1,    // hours
    service: null,
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

    start: function() {
        this.stop();
        var interval = this.pingInterval * 1000 * 60 * 60;  // covert to hours
        this.taskId = setInterval($.proxy(this.refreshAll, this), interval);
        this.refreshAll();
    },

    stop: function() {
        if (this.taskId) {
            clearInterval(this.taskId);
            this.taskId = null;
        }
    },

    onUpdateFinished: function() {
        var updated = this.parcels.getUpdated();
        if (updated.length !== 0) {
            BP.utils.dateFormatter.showUpdateNotification(updated);
            BP.utils.updateMainIcon(updated);
        }
    },

    refreshAll: function () {
        this.parcels.refreshAll().then($.proxy(this.onUpdateFinished, this));
    },

    onNotificationClick: function(id) {
    }

}, {});

$(function () {
    (new BP.tracker.BackgroundWorker());
});