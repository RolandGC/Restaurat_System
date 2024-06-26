/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from './Utilities.js';
var addEvent = U.addEvent, isFunction = U.isFunction, objectEach = U.objectEach, removeEvent = U.removeEvent;
/* *
 *
 *  Functions
 *
 * */
/*
 * Register event options. If an event handler is set on the options, it should
 * be subject to Chart.update, Axis.update and Series.update. This is contrary
 * to general handlers that are set directly using addEvent either on the class
 * or on the instance. #6538, #6943, #10861.
 */
var registerEventOptions = function (component, options) {
    // A lookup over those events that are added by _options_ (not
    // programmatically). These are updated through .update()
    component.eventOptions = component.eventOptions || {};
    // Register event listeners
    objectEach(options.events, function (event, eventType) {
        if (isFunction(event)) {
            // If event does not exist, or is changed by the .update()
            // function
            if (component.eventOptions[eventType] !== event) {
                // Remove existing if set by option
                if (isFunction(component.eventOptions[eventType])) {
                    removeEvent(component, eventType, component.eventOptions[eventType]);
                }
                component.eventOptions[eventType] = event;
                addEvent(component, eventType, event);
            }
        }
    });
};
/* *
 *
 *  Default Export
 *
 * */
var exports = {
    registerEventOptions: registerEventOptions
};
export default exports;
