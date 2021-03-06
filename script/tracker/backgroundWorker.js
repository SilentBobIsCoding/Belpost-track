BP.tracker.BackgroundWorker = can.Construct.extend({}, {
    pingInterval: 1,    // hours
    service: null,
    taskId: null,
    parcels: null,

    init: function () {
        this.model = BP.model.Parcel;
        this.start();
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
            //BP.utils.showUpdateNotification(updated);
            BP.utils.updateMainIcon(updated);
        }
    },

    refreshAll: function () {
        var that = this;

        this.model.findAll({}, function (parcels) {
            that.parcels = parcels;
            that.parcels.refreshAll().then($.proxy(that.onUpdateFinished, that));
        });
    }
}, {});

$(function () {
    (new BP.tracker.BackgroundWorker());
});