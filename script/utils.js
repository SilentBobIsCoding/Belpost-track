BP.utils.dateFormatter = function (date) {
    var res = '';
    if (date instanceof Date) {
        var parts = [date.getDate(), date.getMonth() + 1, date.getFullYear() % 100];
        parts.forEach(function (part, i) {
            parts[i] = (part < 10 ? '0' + part : part);
        });
        res = parts.join('.');
    }

    return res;
};

BP.utils.updateMainIcon = function (parcels) {
    if (parcels && parcels.length) {
        chrome.browserAction.setBadgeBackgroundColor({color: [190, 190, 190, 230]});
        chrome.browserAction.setBadgeText({text: parcels.length + ''});
    } else {
        chrome.browserAction.setBadgeText({text: ''});
    }
//    chrome.browserAction.setIcon({path: 'images/icon_color.png'});
};

BP.utils.showUpdateNotification = function(parcels) {
    var list = [];
    parcels.each(function(parcel) {
        list.push({
            title: parcel.attr('description'),
            message: parcel.attr('recentEvent').eventName
        });
    });

    var strings = {
        popupTitle: 'You have an update!',
        popupMessage: 'Following items were updated:'
    };

    var params = {
        type: 'list',
        iconUrl: ' images/icon_big.png',
        title: strings.popupTitle,
        message: strings.popupMessage,
        items: list
    };

    chrome.notifications.create('belpostNotification', params, function() { });
};

BP.utils.stub = function () {
    chrome.storage = {
        sync: {
            get: function (key, cb) {
                var data = localStorage[key];
                cb(data ? { tracks: data } : {});
            },
            set: function (data, cb) {
                can.each(data, function (val, key) {
                    localStorage[key] = val;
                });

                cb();
            }
        }
    };

    chrome.browserAction = {
        setBadgeText: function() {}
    };
};

//BP.utils.stub(); //Uncomment to debug in Chrome