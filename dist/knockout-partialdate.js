(function(factory) {
    if (typeof require === 'function' && typeof module === 'object') {
        factory(require('knockout'));
    } else if (typeof define === 'function' && define['amd']) {
        define(['knockout'], factory);
    } else {
        factory(ko);
    }
}(function(ko) {

    var parts = ['year', 'month', 'date', 'hours', 'minutes', 'seconds'];

    ko.extenders['partialdate'] = function(target) {

        var values = {};

        // Update parts when target is written
        var result = ko.pureComputed({
            read: target, // Return the original value
            write: function(value) {
                var unwrapped = ko.unwrap(value);
                if (unwrapped instanceof Date) {
                    // Update partial values
                    parts.forEach(function(part) {
                        // Do magic
                        var p = part === 'year' ? 'FullYear' : part;
                        values[part] = unwrapped[('get' + p.charAt(0).toUpperCase() + p.slice(1))]();
                    });
                }
            }
        });

        // Add each part property to the target
        parts.forEach(function(part) {

            result[part] = ko.pureComputed({
                read: function() {
                    return values[part];
                },
                write: function(value) {

                    // Update the partial value
                    values[part] = value;

                    // Check if this makes a valid date
                    var isAnyPartNan = false;
                    var ctorValues = parts.map(function(p) {
                        var v = parseInt(values[p], 10);
                        isAnyPartNan = isAnyPartNan || isNaN(v);
                        return v;
                    });

                    if (isAnyPartNan) {
                        target(null);
                        return;
                    }

                    // Call date constructor with part values
                    var date = new (Function.prototype.bind.apply(Date, [null].concat(ctorValues)));
                    if (!isNaN(date.getTime())) {
                        target(date);
                        return;
                    }

                    target(null);
                }
            });
        });

        // initialize with current value;
        result(target());

        // return the new computed observable
        return result;
    }
}));