BP.model.Parcel = can.Model.extend({
    init: function () {
        this.service = new BP.tracker.TrackingService();
    },
    findAll: function () {
        var deferred = $.Deferred();
        this._getParcels(function (items) {
            deferred.resolve(items);
        });

        return deferred;
    },
    findOne: function (params) {
        var id = params ? params.id : undefined;
        return $.Deferred().resolve(this._getParcelById(id));
    },
    create: function (parcel) {
        parcel.id = this._getId();
        this._data.push(parcel);
        this._sync();

        return $.Deferred().resolve({id: parcel.id});
    },
    update: function (id, parcel) {
        var existing = this._getParcelById(id);
        if (existing) {
            existing.number = parcel.number;
            existing.description = parcel.description;
            existing.recentEvent = parcel.recentEvent;
            existing.isUpdated = parcel.isUpdated;
            this._sync();
        }

        return $.Deferred().resolve();
    },
    destroy: function (id) {
        var parcel = this._getParcelById(id);
        var all = this._data;
        var index = all.indexOf(parcel);
        all.splice(index, 1);
        this._sync();

        return $.Deferred().resolve();
    },
    service: null,
    _data: null,
    _getParcels: function (cb) {
//        var items = localStorage['tracks'];
        var items = chrome.storage.sync.get('tracks', can.proxy(function (storeData) {
            this._data = storeData.tracks ? JSON.parse(storeData.tracks) : [];
            this._data.forEach(function (parcel) {
                if (parcel.recentEvent) {
                    parcel.recentEvent.date = new Date(parcel.recentEvent.date);
                }
            });

            cb.call(this, this._data);
        }, this));
    },
    _getParcelById: function (id) {
        var all = this._data;
        var parcel;
        for (var i = all.length; i--;) {
            if (all[i].id === id) {
                parcel = all[i];
                break;
            }
        }
        return parcel;
    },
    _sync: function () {
//        localStorage['tracks'] = JSON.stringify(this._data);
        chrome.storage.sync.set({'tracks': JSON.stringify(this._data)}, function () {
            chrome.runtime.lastError;
        });
    },
    _getId: function () {
        var all = this._data;
        return (all.length ? all[all.length - 1].id : 0) + 1;
    }
}, {
    isValid: function () {
        return !!(this.attr('number') && this.attr('description'));
    }
    // RS132993305NL VV046009235BY
});