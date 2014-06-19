var BackgroundWorker = function() {
    this.tracker = new Tracker();
};

BackgroundWorker.prototype = {
    pingInterval: 1,    // hours
    tracker: null,
    notificationId: 'background',
    taskId: null,

    strings: {
        popupTitle: 'You have an update',
        popupMessage: 'Following items were updated:'
    },

    start: function() {
        this.stop();
        var interval = this.pingInterval * 1000 * 60 * 60;  // covert to hours
        this.taskId = setInterval($.proxy(this.checkUpdates, this), interval);
        this.checkUpdates();
    },

    stop: function() {
        if (this.taskId) {
            clearInterval(this.taskId);
            this.taskId = null;
        }
    },

    checkUpdates: function() {
        this.tracker.updateAll(this.onUpdateFinished, this);
    },

    onUpdateFinished: function(tracks) {
        var updated = tracks.filter(function(track) {
            return track.statusUpdated;
        });

        if (updated.length !== 0) {
            this.showUpdateNotification(updated);
        }
    },

    showUpdateNotification: function(tracks) {
        var list = tracks.map(function(track) {
            return {
                title: track.description,
                message: track.recentEvent.eventName
            };
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

    onNotificationClick: function(id) {
    },

    emptyFn: function() {}
};