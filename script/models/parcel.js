var PARCELS = [
    {
        "id": 0,
        "recentEvent": "blue",
        "number": "+1 (819) 538-2841",
        "description": "Tourmania"
    },
    {
        "id": 1,
        "recentEvent": "blue",
        "number": "+1 (818) 479-2284",
        "description": "Macronaut"
    },
    {
        "id": 2,
        "recentEvent": "brown",
        "number": "+1 (964) 413-3988",
        "description": "Opticall"
    },
    {
        "id": 3,
        "recentEvent": "blue",
        "number": "+1 (812) 588-2386",
        "description": "Combogene"
    },
    {
        "id": 4,
        "recentEvent": "brown",
        "number": "+1 (985) 404-2842",
        "description": "Arctiq"
    }
];


BP.model.Parcel = can.Model.extend({
        findAll: function () {
            return $.Deferred().resolve(PARCELS);
        },
        findOne: function (params) {
            return $.Deferred().resolve(PARCELS[(+params.id) - 1]);
        },
        update: function (id, attrs) {
            // update PARCELS with the new attrs
            $.extend(PARCELS[id - 1], attrs);
            return $.Deferred().resolve()
        },
        destroy: function () {
            return $.Deferred().resolve()
        }
    },
{});