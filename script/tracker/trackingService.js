/**
 * Created by azhukouski on 6/19/2014.
 */


BP.tracker.TrackingService = can.Construct.extend({
    ERROR_CODES: {
        success: 0,
        failure: 1
    }
}, {
    serviceUrl: 'http://declaration.belpost.by/searchRu.aspx?search=',


    getRequestParams: function(cfg) {
        return null;
    },

    getRequestUrl: function (trackNumber) {
        return this.serviceUrl + trackNumber;
    },

    request: function(cfg) {
        if (!cfg) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: this.getRequestUrl(cfg.trackNumber),
            data: this.getRequestParams(cfg),
            success: function(data, status, xhr) {
                if (cfg.callback) {
                    cfg.callback.call(cfg.scope, BP.tracker.TrackingService.ERROR_CODES.success, data);
                }
            },
            error: function(xhr, errorType) {
                if (cfg.callback) {
                    cfg.callback.call(cfg.scope, BP.tracker.TrackingService.ERROR_CODES.failure);
                }
            }
        });

    },

    getTrackingData: function(trackNumber, callback, scope) {
        if (!(trackNumber && callback)) {
            return;
        }

        this.request({
            trackNumber: trackNumber,
            callback: function(errorCode, response) {
                if (callback) {
                    var data;
                    if (errorCode === BP.tracker.TrackingService.ERROR_CODES.success) {
                        data = this.processResponse(response);
                    }
                    callback.call(scope || this, errorCode, data);
                }
            },
            scope: this
        });
    },

    processResponse: function(response) {
        if (response) {
            response = response.replace(/script/gi, 'div');
        } else {
            return null;
        }

        $(document.body).append('<div id="tmptable" style="display: none; position: absolute;"/></div>');
        var el = $('#tmptable').html(response);
        var tables = el.find('table') || [];
        var outsideTrack = this.parseTableEl(tables[0]);
        var insideTrack = this.parseTableEl(tables[1]);

        el.remove();

        return {
            outsideTrack: outsideTrack,
            insideTrack: insideTrack
        };
    },

    parseTableEl: function(table) {
        if (!table) {
            return null;
        }

        var space = ' ';
        var rows = $('tr', table), result = [];
        $.each(rows, function(index, row) {
            var cells = $('td', row);
            if (!cells.length) {
                return;
            }

            var data = cells.map(function(i, cell) {
                return cell.innerText;
            });
            var dateArray = data[0].split(space);
            if (dateArray[0].indexOf('.') !== -1) {
                dateArray[0] = dateArray[0].split('.').reverse().join('-');
                data[0] = dateArray.join(space);
            }

            if (data.length > 0 && index !== 0) {   // index === 0 is table's header
                result.push({
                    date: new Date(data[0]),
                    eventName: data[1],
                    location: data[2]
                });
            }
        });

        return result;
    }
});