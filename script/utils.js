BP.utils.dateFormatter = function (date) {
    var res = '';
    if (date instanceof Date) {
        var parts = [date.getDate(), date.getMonth() + 1, date.getYear() - 100];
        parts.forEach(function (part, i) {
            parts[i] = (part < 10 ? '0' + part : part);
        });
        res = parts.join('.');
    }

    return res;
};