/**
 *
 *  Events generator for Stock tools
 *
 *  (c) 2009-2021 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
import NavigationBindings from '../Extensions/Annotations/NavigationBindings.js';
import D from '../Core/DefaultOptions.js';
var getOptions = D.getOptions, setOptions = D.setOptions;
import Series from '../Core/Series/Series.js';
import U from '../Core/Utilities.js';
import palette from '../Core/Color/Palette.js';
var correctFloat = U.correctFloat, defined = U.defined, extend = U.extend, fireEvent = U.fireEvent, isNumber = U.isNumber, merge = U.merge, pick = U.pick, uniqueKey = U.uniqueKey;
var bindingsUtils = NavigationBindings.prototype.utils, PREFIX = 'highcharts-';
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Generates function which will add a flag series using modal in GUI.
 * Method fires an event "showPopup" with config:
 * `{type, options, callback}`.
 *
 * Example: NavigationBindings.utils.addFlagFromForm('url(...)') - will
 * generate function that shows modal in GUI.
 *
 * @private
 * @function bindingsUtils.addFlagFromForm
 *
 * @param {Highcharts.FlagsShapeValue} type
 *        Type of flag series, e.g. "squarepin"
 *
 * @return {Function}
 *         Callback to be used in `start` callback
 */
bindingsUtils.addFlagFromForm = function (type) {
    return function (e) {
        var navigation = this, chart = navigation.chart, toolbar = chart.stockTools, getFieldType = bindingsUtils.getFieldType, point = bindingsUtils.attractToPoint(e, chart), pointConfig, seriesOptions;
        if (!point) {
            return;
        }
        pointConfig = {
            x: point.x,
            y: point.y
        };
        seriesOptions = {
            type: 'flags',
            onSeries: point.series.id,
            shape: type,
            data: [pointConfig],
            xAxis: point.xAxis,
            yAxis: point.yAxis,
            point: {
                events: {
                    click: function () {
                        var point = this, options = point.options;
                        fireEvent(navigation, 'showPopup', {
                            point: point,
                            formType: 'annotation-toolbar',
                            options: {
                                langKey: 'flags',
                                type: 'flags',
                                title: [
                                    options.title,
                                    getFieldType(options.title)
                                ],
                                name: [
                                    options.name,
                                    getFieldType(options.name)
                                ]
                            },
                            onSubmit: function (updated) {
                                if (updated.actionType === 'remove') {
                                    point.remove();
                                }
                                else {
                                    point.update(navigation.fieldsToOptions(updated.fields, {}));
                                }
                            }
                        });
                    }
                }
            }
        };
        if (!toolbar || !toolbar.guiEnabled) {
            chart.addSeries(seriesOptions);
        }
        fireEvent(navigation, 'showPopup', {
            formType: 'flag',
            // Enabled options:
            options: {
                langKey: 'flags',
                type: 'flags',
                title: ['A', getFieldType('A')],
                name: ['Flag A', getFieldType('Flag A')]
            },
            // Callback on submit:
            onSubmit: function (data) {
                navigation.fieldsToOptions(data.fields, seriesOptions.data[0]);
                chart.addSeries(seriesOptions);
            }
        });
    };
};
bindingsUtils.manageIndicators = function (data) {
    var navigation = this, chart = navigation.chart, seriesConfig = {
        linkedTo: data.linkedTo,
        type: data.type
    }, indicatorsWithVolume = [
        'ad',
        'cmf',
        'klinger',
        'mfi',
        'obv',
        'vbp',
        'vwap'
    ], indicatorsWithAxes = [
        'ad',
        'atr',
        'cci',
        'cmf',
        'disparityindex',
        'cmo',
        'dmi',
        'macd',
        'mfi',
        'roc',
        'rsi',
        'ao',
        'aroon',
        'aroonoscillator',
        'trix',
        'apo',
        'dpo',
        'ppo',
        'natr',
        'obv',
        'williamsr',
        'stochastic',
        'slowstochastic',
        'linearRegression',
        'linearRegressionSlope',
        'linearRegressionIntercept',
        'linearRegressionAngle',
        'klinger'
    ], yAxis, parentSeries, defaultOptions, series;
    if (data.actionType === 'edit') {
        navigation.fieldsToOptions(data.fields, seriesConfig);
        series = chart.get(data.seriesId);
        if (series) {
            series.update(seriesConfig, false);
        }
    }
    else if (data.actionType === 'remove') {
        series = chart.get(data.seriesId);
        if (series) {
            yAxis = series.yAxis;
            if (series.linkedSeries) {
                series.linkedSeries.forEach(function (linkedSeries) {
                    linkedSeries.remove(false);
                });
            }
            series.remove(false);
            if (indicatorsWithAxes.indexOf(series.type) >= 0) {
                var removedYAxisHeight = yAxis.options.height;
                yAxis.remove(false);
                navigation.resizeYAxes(removedYAxisHeight);
            }
        }
    }
    else {
        seriesConfig.id = uniqueKey();
        navigation.fieldsToOptions(data.fields, seriesConfig);
        parentSeries = chart.get(seriesConfig.linkedTo);
        defaultOptions = getOptions().plotOptions;
        // Make sure that indicator uses the SUM approx if SUM approx is used
        // by parent series (#13950).
        if (typeof parentSeries !== 'undefined' &&
            parentSeries instanceof Series &&
            parentSeries.getDGApproximation() === 'sum' &&
            // If indicator has defined approx type, use it (e.g. "ranges")
            !defined(defaultOptions && defaultOptions[seriesConfig.type] &&
                defaultOptions.dataGrouping &&
                defaultOptions.dataGrouping.approximation)) {
            seriesConfig.dataGrouping = {
                approximation: 'sum'
            };
        }
        if (indicatorsWithAxes.indexOf(data.type) >= 0) {
            yAxis = chart.addAxis({
                id: uniqueKey(),
                offset: 0,
                opposite: true,
                title: {
                    text: ''
                },
                tickPixelInterval: 40,
                showLastLabel: false,
                labels: {
                    align: 'left',
                    y: -2
                }
            }, false, false);
            seriesConfig.yAxis = yAxis.options.id;
            navigation.resizeYAxes();
        }
        else {
            seriesConfig.yAxis = chart.get(data.linkedTo).options.yAxis;
        }
        if (indicatorsWithVolume.indexOf(data.type) >= 0) {
            seriesConfig.params.volumeSeriesID = chart.series.filter(function (series) {
                return series.options.type === 'column';
            })[0].options.id;
        }
        chart.addSeries(seriesConfig, false);
    }
    fireEvent(navigation, 'deselectButton', {
        button: navigation.selectedButtonElement
    });
    chart.redraw();
};
/**
 * Update height for an annotation. Height is calculated as a difference
 * between last point in `typeOptions` and current position. It's a value,
 * not pixels height.
 *
 * @private
 * @function bindingsUtils.updateHeight
 *
 * @param {Highcharts.PointerEventObject} e
 *        normalized browser event
 *
 * @param {Highcharts.Annotation} annotation
 *        Annotation to be updated
 *
 * @return {void}
 */
bindingsUtils.updateHeight = function (e, annotation) {
    var coordsY = this.utils.getAssignedAxis(this.chart.pointer.getCoordinates(e).yAxis);
    if (coordsY) {
        annotation.update({
            typeOptions: {
                height: coordsY.value -
                    annotation.options.typeOptions.points[1].y
            }
        });
    }
};
// @todo
// Consider using getHoverData(), but always kdTree (columns?)
bindingsUtils.attractToPoint = function (e, chart) {
    var coords = chart.pointer.getCoordinates(e), coordsX, coordsY, distX = Number.MAX_VALUE, closestPoint, x, y;
    if (chart.navigationBindings) {
        coordsX = chart.navigationBindings.utils.getAssignedAxis(coords.xAxis);
        coordsY = chart.navigationBindings.utils.getAssignedAxis(coords.yAxis);
    }
    // Exit if clicked out of axes area.
    if (!coordsX || !coordsY) {
        return;
    }
    x = coordsX.value;
    y = coordsY.value;
    // Search by 'x' but only in yAxis' series.
    coordsY.axis.series.forEach(function (series) {
        if (series.points) {
            series.points.forEach(function (point) {
                if (point && distX > Math.abs(point.x - x)) {
                    distX = Math.abs(point.x - x);
                    closestPoint = point;
                }
            });
        }
    });
    if (closestPoint && closestPoint.x && closestPoint.y) {
        return {
            x: closestPoint.x,
            y: closestPoint.y,
            below: y < closestPoint.y,
            series: closestPoint.series,
            xAxis: closestPoint.series.xAxis.options.index || 0,
            yAxis: closestPoint.series.yAxis.options.index || 0
        };
    }
};
/**
 * Shorthand to check if given yAxis comes from navigator.
 *
 * @private
 * @function bindingsUtils.isNotNavigatorYAxis
 *
 * @param {Highcharts.Axis} axis
 * Axis to check.
 *
 * @return {boolean}
 * True, if axis comes from navigator.
 */
bindingsUtils.isNotNavigatorYAxis = function (axis) {
    return axis.userOptions.className !== PREFIX + 'navigator-yaxis';
};
/**
 * Check if any of the price indicators are enabled.
 * @private
 * @function bindingsUtils.isLastPriceEnabled
 *
 * @param {array} series
 *        Array of series.
 *
 * @return {boolean}
 *         Tells which indicator is enabled.
 */
bindingsUtils.isPriceIndicatorEnabled = function (series) {
    return series.some(function (s) { return s.lastVisiblePrice || s.lastPrice; });
};
/**
 * Update each point after specified index, most of the annotations use
 * this. For example crooked line: logic behind updating each point is the
 * same, only index changes when adding an annotation.
 *
 * Example: NavigationBindings.utils.updateNthPoint(1) - will generate
 * function that updates all consecutive points except point with index=0.
 *
 * @private
 * @function bindingsUtils.updateNthPoint
 *
 * @param {number} startIndex
 *        Index from each point should udpated
 *
 * @return {Function}
 *         Callback to be used in steps array
 */
bindingsUtils.updateNthPoint = function (startIndex) {
    return function (e, annotation) {
        var options = annotation.options.typeOptions, coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
        if (coordsX && coordsY) {
            options.points.forEach(function (point, index) {
                if (index >= startIndex) {
                    point.x = coordsX.value;
                    point.y = coordsY.value;
                }
            });
            annotation.update({
                typeOptions: {
                    points: options.points
                }
            });
        }
    };
};
// Extends NavigationBindigs to support indicators and resizers:
extend(NavigationBindings.prototype, {
    /* eslint-disable valid-jsdoc */
    /**
     * Get current positions for all yAxes. If new axis does not have position,
     * returned is default height and last available top place.
     *
     * @private
     * @function Highcharts.NavigationBindings#getYAxisPositions
     *
     * @param {Array<Highcharts.Axis>} yAxes
     *        Array of yAxes available in the chart.
     *
     * @param {number} plotHeight
     *        Available height in the chart.
     *
     * @param {number} defaultHeight
     *        Default height in percents.
     *
     * @param {string} removedYAxisHeight
     *        Height of the removed yAxis in percents.
     *
     * @return {Highcharts.YAxisPositions}
     *         An object containing an array of calculated positions
     *         in percentages. Format: `{top: Number, height: Number}`
     *         and maximum value of top + height of axes.
     */
    getYAxisPositions: function (yAxes, plotHeight, defaultHeight, removedYAxisHeight) {
        var positions, allAxesHeight = 0, previousAxisHeight, removedHeight;
        /** @private */
        function isPercentage(prop) {
            return defined(prop) && !isNumber(prop) && prop.match('%');
        }
        if (removedYAxisHeight) {
            removedHeight = correctFloat((parseFloat(removedYAxisHeight) / 100));
        }
        positions = yAxes.map(function (yAxis, index) {
            var height = correctFloat(isPercentage(yAxis.options.height) ?
                parseFloat(yAxis.options.height) / 100 :
                yAxis.height / plotHeight), top = correctFloat(isPercentage(yAxis.options.top) ?
                parseFloat(yAxis.options.top) / 100 :
                (yAxis.top - yAxis.chart.plotTop) / plotHeight);
            // New axis' height is NaN so we can check if
            // the axis is newly created this way
            if (!removedHeight) {
                if (!isNumber(height)) {
                    // Check if the previous axis is the
                    // indicator axis (every indicator inherits from sma)
                    height = yAxes[index - 1].series.every(function (s) { return s.is('sma'); }) ?
                        previousAxisHeight : defaultHeight / 100;
                }
                if (!isNumber(top)) {
                    top = allAxesHeight;
                }
                previousAxisHeight = height;
                allAxesHeight = correctFloat(Math.max(allAxesHeight, (top || 0) + (height || 0)));
            }
            else {
                if (top <= allAxesHeight) {
                    allAxesHeight = correctFloat(Math.max(allAxesHeight, (top || 0) + (height || 0)));
                }
                else {
                    top = correctFloat(top - removedHeight);
                    allAxesHeight = correctFloat(allAxesHeight + height);
                }
            }
            return {
                height: height * 100,
                top: top * 100
            };
        });
        return { positions: positions, allAxesHeight: allAxesHeight };
    },
    /**
     * Get current resize options for each yAxis. Note that each resize is
     * linked to the next axis, except the last one which shouldn't affect
     * axes in the navigator. Because indicator can be removed with it's yAxis
     * in the middle of yAxis array, we need to bind closest yAxes back.
     *
     * @private
     * @function Highcharts.NavigationBindings#getYAxisResizers
     *
     * @param {Array<Highcharts.Axis>} yAxes
     *        Array of yAxes available in the chart
     *
     * @return {Array<object>}
     *         An array of resizer options.
     *         Format: `{enabled: Boolean, controlledAxis: { next: [String]}}`
     */
    getYAxisResizers: function (yAxes) {
        var resizers = [];
        yAxes.forEach(function (_yAxis, index) {
            var nextYAxis = yAxes[index + 1];
            // We have next axis, bind them:
            if (nextYAxis) {
                resizers[index] = {
                    enabled: true,
                    controlledAxis: {
                        next: [
                            pick(nextYAxis.options.id, nextYAxis.options.index)
                        ]
                    }
                };
            }
            else {
                // Remove binding:
                resizers[index] = {
                    enabled: false
                };
            }
        });
        return resizers;
    },
    /**
     * Resize all yAxes (except navigator) to fit the plotting height. Method
     * checks if new axis is added, if the new axis will fit under previous
     * axes it is placed there. If not, current plot area is scaled
     * to make room for new axis.
     *
     * If axis is removed, the current plot area streaches to fit into 100%
     * of the plot area.
     *
     * @private
     * @function Highcharts.NavigationBindings#resizeYAxes
     * @param {string} [removedYAxisHeight]
     *
     *
     */
    resizeYAxes: function (removedYAxisHeight) {
        // The height of the new axis before rescalling. In %, but as a number.
        var defaultHeight = 20;
        var chart = this.chart, 
        // Only non-navigator axes
        yAxes = chart.yAxis.filter(bindingsUtils.isNotNavigatorYAxis), plotHeight = chart.plotHeight, 
        // Gather current heights (in %)
        _a = this.getYAxisPositions(yAxes, plotHeight, defaultHeight, removedYAxisHeight), positions = _a.positions, allAxesHeight = _a.allAxesHeight, resizers = this.getYAxisResizers(yAxes);
        // check if the axis is being either added or removed and
        // if the new indicator axis will fit under existing axes.
        // if so, there is no need to scale them.
        if (!removedYAxisHeight &&
            allAxesHeight <= correctFloat(0.8 + defaultHeight / 100)) {
            positions[positions.length - 1] = {
                height: defaultHeight,
                top: correctFloat(allAxesHeight * 100 - defaultHeight)
            };
        }
        else {
            positions.forEach(function (position) {
                position.height = (position.height / (allAxesHeight * 100)) * 100;
                position.top = (position.top / (allAxesHeight * 100)) * 100;
            });
        }
        positions.forEach(function (position, index) {
            yAxes[index].update({
                height: position.height + '%',
                top: position.top + '%',
                resize: resizers[index],
                offset: 0
            }, false);
        });
    },
    /**
     * Utility to modify calculated positions according to the remaining/needed
     * space. Later, these positions are used in `yAxis.update({ top, height })`
     *
     * @private
     * @function Highcharts.NavigationBindings#recalculateYAxisPositions
     * @param {Array<Highcharts.Dictionary<number>>} positions
     * Default positions of all yAxes.
     * @param {number} changedSpace
     * How much space should be added or removed.
     * @param {boolean} modifyHeight
     * Update only `top` or both `top` and `height`.
     * @param {number} adder
     * `-1` or `1`, to determine whether we should add or remove space.
     *
     * @return {Array<object>}
     *         Modified positions,
     */
    recalculateYAxisPositions: function (positions, changedSpace, modifyHeight, adder) {
        positions.forEach(function (position, index) {
            var prevPosition = positions[index - 1];
            position.top = !prevPosition ? 0 :
                correctFloat(prevPosition.height + prevPosition.top);
            if (modifyHeight) {
                position.height = correctFloat(position.height + adder * changedSpace);
            }
        });
        return positions;
    }
    /* eslint-enable valid-jsdoc */
});
/**
 * @type         {Highcharts.Dictionary<Highcharts.NavigationBindingsOptionsObject>}
 * @since        7.0.0
 * @optionparent navigation.bindings
 */
var stockToolsBindings = {
    // Line type annotations:
    /**
     * A segment annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-segment", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    segment: {
        /** @ignore-option */
        className: 'highcharts-segment',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'segment',
                type: 'crookedLine',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.segment.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A segment with an arrow annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-segment", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowSegment: {
        /** @ignore-option */
        className: 'highcharts-arrow-segment',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'arrowSegment',
                type: 'crookedLine',
                typeOptions: {
                    line: {
                        markerEnd: 'arrow'
                    },
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.arrowSegment.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-ray", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    ray: {
        /** @ignore-option */
        className: 'highcharts-ray',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'ray',
                type: 'infinityLine',
                typeOptions: {
                    type: 'ray',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.ray.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray with an arrow annotation bindings. Includes `start` and one event
     * in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-ray", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowRay: {
        /** @ignore-option */
        className: 'highcharts-arrow-ray',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'arrowRay',
                type: 'infinityLine',
                typeOptions: {
                    type: 'ray',
                    line: {
                        markerEnd: 'arrow'
                    },
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.arrowRay.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line annotation. Includes `start` and one event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-infinity-line", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    infinityLine: {
        /** @ignore-option */
        className: 'highcharts-infinity-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'infinityLine',
                type: 'infinityLine',
                typeOptions: {
                    type: 'line',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.infinityLine.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line with arrow annotation. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-infinity-line", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowInfinityLine: {
        /** @ignore-option */
        className: 'highcharts-arrow-infinity-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'arrowInfinityLine',
                type: 'infinityLine',
                typeOptions: {
                    type: 'line',
                    line: {
                        markerEnd: 'arrow'
                    },
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.arrowInfinityLine.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A horizontal line annotation. Includes `start` event.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-horizontal-line", "start": function() {}, "annotationsOptions": {}}
     */
    horizontalLine: {
        /** @ignore-option */
        className: 'highcharts-horizontal-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'horizontalLine',
                type: 'infinityLine',
                draggable: 'y',
                typeOptions: {
                    type: 'horizontalLine',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.horizontalLine.annotationsOptions);
            this.chart.addAnnotation(options);
        }
    },
    /**
     * A vertical line annotation. Includes `start` event.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-line", "start": function() {}, "annotationsOptions": {}}
     */
    verticalLine: {
        /** @ignore-option */
        className: 'highcharts-vertical-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis), navigation = this.chart.options.navigation, options;
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            options = merge({
                langKey: 'verticalLine',
                type: 'infinityLine',
                draggable: 'x',
                typeOptions: {
                    type: 'verticalLine',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.verticalLine.annotationsOptions);
            this.chart.addAnnotation(options);
        }
    },
    /**
     * Crooked line (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points in crooked line) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    // Crooked Line type annotations:
    crooked3: {
        /** @ignore-option */
        className: 'highcharts-crooked3',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'crooked3',
                type: 'crookedLine',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y }
                    ]
                }
            }, navigation.annotationsOptions, navigation.bindings.crooked3.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    /**
     * Crooked line (five points) annotation bindings. Includes `start` and four
     * events in `steps` (for all consequent points in crooked line) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}], "annotationsOptions": {}}
     */
    crooked5: {
        /** @ignore-option */
        className: 'highcharts-crooked5',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'crookedLine',
                type: 'crookedLine',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y }
                    ]
                }
            }, navigation.annotationsOptions, navigation.bindings.crooked5.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4)
        ]
    },
    /**
     * Elliott wave (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    elliott3: {
        /** @ignore-option */
        className: 'highcharts-elliott3',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'elliott3',
                type: 'elliottWave',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y }
                    ]
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.elliott3.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3)
        ]
    },
    /**
     * Elliott wave (five points) annotation bindings. Includes `start` and four
     * event in `steps` (for all consequent points in Elliott wave) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}], "annotationsOptions": {}}
     */
    elliott5: {
        /** @ignore-option */
        className: 'highcharts-elliott5',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'elliott5',
                type: 'elliottWave',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y },
                        { x: x, y: y }
                    ]
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.elliott5.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4),
            bindingsUtils.updateNthPoint(5)
        ]
    },
    /**
     * A measure (x-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-x", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureX: {
        /** @ignore-option */
        className: 'highcharts-measure-x',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'measure',
                type: 'measure',
                typeOptions: {
                    selectType: 'x',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    point: { x: x, y: y },
                    crosshairX: {
                        strokeWidth: 1,
                        stroke: palette.neutralColor100
                    },
                    crosshairY: {
                        enabled: false,
                        strokeWidth: 0,
                        stroke: palette.neutralColor100
                    },
                    background: {
                        width: 0,
                        height: 0,
                        strokeWidth: 0,
                        stroke: palette.backgroundColor
                    }
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.measureX.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (y-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-y", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureY: {
        /** @ignore-option */
        className: 'highcharts-measure-y',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'measure',
                type: 'measure',
                typeOptions: {
                    selectType: 'y',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    point: { x: x, y: y },
                    crosshairX: {
                        enabled: false,
                        strokeWidth: 0,
                        stroke: palette.neutralColor100
                    },
                    crosshairY: {
                        strokeWidth: 1,
                        stroke: palette.neutralColor100
                    },
                    background: {
                        width: 0,
                        height: 0,
                        strokeWidth: 0,
                        stroke: palette.backgroundColor
                    }
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.measureY.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (xy-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-xy", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureXY: {
        /** @ignore-option */
        className: 'highcharts-measure-xy',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'measure',
                type: 'measure',
                typeOptions: {
                    selectType: 'xy',
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    point: { x: x, y: y },
                    background: {
                        width: 0,
                        height: 0,
                        strokeWidth: 10
                    },
                    crosshairX: {
                        strokeWidth: 1,
                        stroke: palette.neutralColor100
                    },
                    crosshairY: {
                        strokeWidth: 1,
                        stroke: palette.neutralColor100
                    }
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.measureXY.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    // Advanced type annotations:
    /**
     * A fibonacci annotation bindings. Includes `start` and two events in
     * `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-fibonacci", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    fibonacci: {
        /** @ignore-option */
        className: 'highcharts-fibonacci',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'fibonacci',
                type: 'fibonacci',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [
                        { x: x, y: y },
                        { x: x, y: y }
                    ]
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.fibonacci.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * A parallel channel (tunnel) annotation bindings. Includes `start` and
     * two events in `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-parallel-channel", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    parallelChannel: {
        /** @ignore-option */
        className: 'highcharts-parallel-channel',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'parallelChannel',
                type: 'tunnel',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [
                        { x: x, y: y },
                        { x: x, y: y }
                    ]
                }
            }, navigation.annotationsOptions, navigation.bindings.parallelChannel.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * An Andrew's pitchfork annotation bindings. Includes `start` and two
     * events in `steps` array (sets second and third control points).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-pitchfork", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    pitchfork: {
        /** @ignore-option */
        className: 'highcharts-pitchfork',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), coordsX = this.utils.getAssignedAxis(coords.xAxis), coordsY = this.utils.getAssignedAxis(coords.yAxis);
            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }
            var x = coordsX.value, y = coordsY.value, navigation = this.chart.options.navigation, options = merge({
                langKey: 'pitchfork',
                type: 'pitchfork',
                typeOptions: {
                    xAxis: coordsX.axis.options.index,
                    yAxis: coordsY.axis.options.index,
                    points: [{
                            x: coordsX.value,
                            y: coordsY.value,
                            controlPoint: {
                                style: {
                                    fill: palette.negativeColor
                                }
                            }
                        }, { x: x, y: y },
                        { x: x, y: y }],
                    innerBackground: {
                        fill: 'rgba(100, 170, 255, 0.8)'
                    }
                },
                shapeOptions: {
                    strokeWidth: 2
                }
            }, navigation.annotationsOptions, navigation.bindings.pitchfork.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    // Labels with arrow and auto increments
    /**
     * A vertical counter annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with a numeric annotation -
     * incrementing counter on each add.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-counter", "start": function() {}, "annotationsOptions": {}}
     */
    verticalCounter: {
        /** @ignore-option */
        className: 'highcharts-vertical-counter',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart), navigation = this.chart.options.navigation, options, annotation;
            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }
            this.verticalCounter = this.verticalCounter || 0;
            options = merge({
                langKey: 'verticalCounter',
                type: 'verticalLine',
                typeOptions: {
                    point: {
                        x: closestPoint.x,
                        y: closestPoint.y,
                        xAxis: closestPoint.xAxis,
                        yAxis: closestPoint.yAxis
                    },
                    label: {
                        offset: closestPoint.below ? 40 : -40,
                        text: this.verticalCounter.toString()
                    }
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60,
                        fontSize: '11px'
                    }
                },
                shapeOptions: {
                    stroke: 'rgba(0, 0, 0, 0.75)',
                    strokeWidth: 1
                }
            }, navigation.annotationsOptions, navigation.bindings.verticalCounter.annotationsOptions);
            annotation = this.chart.addAnnotation(options);
            this.verticalCounter++;
            annotation.options.events.click.call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow and a label with
     * value.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-label", "start": function() {}, "annotationsOptions": {}}
     */
    verticalLabel: {
        /** @ignore-option */
        className: 'highcharts-vertical-label',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart), navigation = this.chart.options.navigation, options, annotation;
            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }
            options = merge({
                langKey: 'verticalLabel',
                type: 'verticalLine',
                typeOptions: {
                    point: {
                        x: closestPoint.x,
                        y: closestPoint.y,
                        xAxis: closestPoint.xAxis,
                        yAxis: closestPoint.yAxis
                    },
                    label: {
                        offset: closestPoint.below ? 40 : -40
                    }
                },
                labelOptions: {
                    style: {
                        color: palette.neutralColor60,
                        fontSize: '11px'
                    }
                },
                shapeOptions: {
                    stroke: 'rgba(0, 0, 0, 0.75)',
                    strokeWidth: 1
                }
            }, navigation.annotationsOptions, navigation.bindings.verticalLabel.annotationsOptions);
            annotation = this.chart.addAnnotation(options);
            annotation.options.events.click.call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow.
     * `${palette.positiveColor}` is the color of the arrow when
     * pointing from above and `${palette.negativeColor}`
     * when pointing from below the point.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-arrow", "start": function() {}, "annotationsOptions": {}}
     */
    verticalArrow: {
        /** @ignore-option */
        className: 'highcharts-vertical-arrow',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart), navigation = this.chart.options.navigation, options, annotation;
            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }
            options = merge({
                langKey: 'verticalArrow',
                type: 'verticalLine',
                typeOptions: {
                    point: {
                        x: closestPoint.x,
                        y: closestPoint.y,
                        xAxis: closestPoint.xAxis,
                        yAxis: closestPoint.yAxis
                    },
                    label: {
                        offset: closestPoint.below ? 40 : -40,
                        format: ' '
                    },
                    connector: {
                        fill: 'none',
                        stroke: closestPoint.below ?
                            palette.negativeColor : palette.positiveColor
                    }
                },
                shapeOptions: {
                    stroke: 'rgba(0, 0, 0, 0.75)',
                    strokeWidth: 1
                }
            }, navigation.annotationsOptions, navigation.bindings.verticalArrow.annotationsOptions);
            annotation = this.chart.addAnnotation(options);
            annotation.options.events.click.call(annotation, {});
        }
    },
    // Flag types:
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'circlepin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-circlepin", "start": function() {}}
     */
    flagCirclepin: {
        /** @ignore-option */
        className: 'highcharts-flag-circlepin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('circlepin')
    },
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'diamondpin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-diamondpin", "start": function() {}}
     */
    flagDiamondpin: {
        /** @ignore-option */
        className: 'highcharts-flag-diamondpin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('flag')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag with
     * `'squarepin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-squarepin", "start": function() {}}
     */
    flagSquarepin: {
        /** @ignore-option */
        className: 'highcharts-flag-squarepin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('squarepin')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag without pin
     * shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-simplepin", "start": function() {}}
     */
    flagSimplepin: {
        /** @ignore-option */
        className: 'highcharts-flag-simplepin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('nopin')
    },
    // Other tools:
    /**
     * Enables zooming in xAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-x", "init": function() {}}
     */
    zoomX: {
        /** @ignore-option */
        className: 'highcharts-zoom-x',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'x'
                }
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Enables zooming in yAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-y", "init": function() {}}
     */
    zoomY: {
        /** @ignore-option */
        className: 'highcharts-zoom-y',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'y'
                }
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Enables zooming in xAxis and yAxis on a chart. Includes `start` event
     * which changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-xy", "init": function() {}}
     */
    zoomXY: {
        /** @ignore-option */
        className: 'highcharts-zoom-xy',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'xy'
                }
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Changes main series to `'line'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-line", "init": function() {}}
     */
    seriesTypeLine: {
        /** @ignore-option */
        className: 'highcharts-series-type-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.series[0].update({
                type: 'line',
                useOhlcData: true
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Changes main series to `'ohlc'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-ohlc", "init": function() {}}
     */
    seriesTypeOhlc: {
        /** @ignore-option */
        className: 'highcharts-series-type-ohlc',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.series[0].update({
                type: 'ohlc'
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Changes main series to `'candlestick'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-candlestick", "init": function() {}}
     */
    seriesTypeCandlestick: {
        /** @ignore-option */
        className: 'highcharts-series-type-candlestick',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.series[0].update({
                type: 'candlestick'
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Displays chart in fullscreen.
     *
     * **Note**: Fullscreen is not supported on iPhone due to iOS limitations.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "noDataState": "normal", "highcharts-full-screen", "init": function() {}}
     */
    fullScreen: {
        /** @ignore-option */
        className: 'highcharts-full-screen',
        noDataState: 'normal',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.fullscreen.toggle();
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Hides/shows two price indicators:
     * - last price in the dataset
     * - last price in the selected range
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-current-price-indicator", "init": function() {}}
     */
    currentPriceIndicator: {
        /** @ignore-option */
        className: 'highcharts-current-price-indicator',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            var chart = this.chart, series = chart.series, gui = chart.stockTools, priceIndicatorEnabled = bindingsUtils.isPriceIndicatorEnabled(chart.series);
            if (gui && gui.guiEnabled) {
                series.forEach(function (series) {
                    series.update({
                        lastPrice: { enabled: !priceIndicatorEnabled },
                        lastVisiblePrice: { enabled: !priceIndicatorEnabled, label: { enabled: true } }
                    }, false);
                });
                chart.redraw();
            }
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Indicators bindings. Includes `init` event to show a popup.
     *
     * Note: In order to show base series from the chart in the popup's
     * dropdown each series requires
     * [series.id](https://api.highcharts.com/highstock/series.line.id) to be
     * defined.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-indicators", "init": function() {}}
     */
    indicators: {
        /** @ignore-option */
        className: 'highcharts-indicators',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function () {
            var navigation = this;
            fireEvent(navigation, 'showPopup', {
                formType: 'indicators',
                options: {},
                // Callback on submit:
                onSubmit: function (data) {
                    navigation.utils.manageIndicators.call(navigation, data);
                }
            });
        }
    },
    /**
     * Hides/shows all annotations on a chart.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-toggle-annotations", "init": function() {}}
     */
    toggleAnnotations: {
        /** @ignore-option */
        className: 'highcharts-toggle-annotations',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            var chart = this.chart, gui = chart.stockTools, iconsURL = gui.getIconsURL();
            this.toggledAnnotations = !this.toggledAnnotations;
            (chart.annotations || []).forEach(function (annotation) {
                annotation.setVisibility(!this.toggledAnnotations);
            }, this);
            if (gui && gui.guiEnabled) {
                if (this.toggledAnnotations) {
                    button.firstChild.style['background-image'] =
                        'url("' + iconsURL +
                            'annotations-hidden.svg")';
                }
                else {
                    button.firstChild.style['background-image'] =
                        'url("' + iconsURL +
                            'annotations-visible.svg")';
                }
            }
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Save a chart in localStorage under `highcharts-chart` key.
     * Stored items:
     * - annotations
     * - indicators (with yAxes)
     * - flags
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-save-chart", "noDataState": "normal", "init": function() {}}
     */
    saveChart: {
        /** @ignore-option */
        className: 'highcharts-save-chart',
        noDataState: 'normal',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            var navigation = this, chart = navigation.chart, annotations = [], indicators = [], flags = [], yAxes = [];
            chart.annotations.forEach(function (annotation, index) {
                annotations[index] = annotation.userOptions;
            });
            chart.series.forEach(function (series) {
                if (series.is('sma')) {
                    indicators.push(series.userOptions);
                }
                else if (series.type === 'flags') {
                    flags.push(series.userOptions);
                }
            });
            chart.yAxis.forEach(function (yAxis) {
                if (bindingsUtils.isNotNavigatorYAxis(yAxis)) {
                    yAxes.push(yAxis.options);
                }
            });
            H.win.localStorage.setItem(PREFIX + 'chart', JSON.stringify({
                annotations: annotations,
                indicators: indicators,
                flags: flags,
                yAxes: yAxes
            }));
            fireEvent(this, 'deselectButton', { button: button });
        }
    }
};
setOptions({
    navigation: {
        bindings: stockToolsBindings
    }
});
NavigationBindings.prototype.utils = merge(bindingsUtils, NavigationBindings.prototype.utils);
