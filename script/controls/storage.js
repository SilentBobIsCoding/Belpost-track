var Store = function() {
    var store = this.getStore();
    if (!store['tracks']) {
        store['tracks'] = JSON.stringify([]);
    }
    this.syncItems();
};

Store.prototype = {
    items: null,

    syncItems: function(saveToStore) {
        if (saveToStore) {
            this.getStore()['tracks'] = JSON.stringify(this.items);
        } else {
            this.items = JSON.parse(this.getStore()['tracks']);
            this.items.forEach(function(track) {
                if (track.recentEvent) {
                    track.recentEvent.date = new Date(track.recentEvent.date);
                }
            });
        }
    },

    getStore: function() {
        return localStorage;
    },

    each: function(fn, scope) {
        this.syncItems();
        for (var i = 0, l = this.items.length; i < l; i++){
            if (fn.call(scope || this, this.items[i], i) === false) {
                break;
            };
        }
    },

    updateTrack: function(track) {
        if (!track) {
            return;
        }

        var existingItem = this.getTrackByNumber(track.number);
        if (existingItem) {
            track.id = existingItem.id;
            var index = this.items.indexOf(existingItem);
            this.items[index] = track;
        } else {
            track.id = this.getNewId();
            this.items.push(track);
        }

        this.syncItems(true);
    },

    getTrack: function(id) {
        var track;
        this.each(function(item) {
            if (item.id === id) {
                track = item;
                return false;
            }
        });
        return track;
    },

    getTrackByNumber: function(trackNumber) {
        var track;
        this.each(function(item) {
            if (item.number === trackNumber) {
                track = item;
                return false;
            }
        });
        return track;
    },

    deleteTrack: function(id) {
        var track = this.getTrack(id);
        if (track) {
            var index = this.items.indexOf(track);
            this.items.splice(index, 1);
            this.syncItems(true);
        }
    },

    deleteAllTracks: function() {
        this.items = [];
        this.syncItems(true);
    },

    getLength: function() {
        return this.items.length;
    },

    getNewId: function() {
        var len = this.getLength();
        return (len ? this.items[len - 1].id : 0) + 1;
    },

    setTimeStamp: function(date) {
        this.getStore()['lastUpdated'] = JSON.stringify(date);
    },

    getTimeStamp: function() {
        var date = this.getStore()['lastUpdated'];
        return date ? new Date(JSON.parse(date)) : null;
    }
};