"use strict";
/*
 * @Author: sweet
 * @Date: 2021-04-19 14:14:17
 * @LastEditors: sweet
 * @LastEditTime: 2021-04-19 14:38:13
 * @Description: file content
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 * 合并reducer，适用于hooks
 */
function combineReducer(modules) {
    var initState = {};
    var keys = Object.keys(modules);
    keys.forEach(function (key) {
        var currentModule = modules[key];
        if (currentModule.isRoot) {
            initState = __assign(__assign({}, initState), (currentModule.initState || {}));
        }
        else {
            initState[key] = currentModule.initState || {};
        }
    });
    return [
        function (state, action) {
            if (state === void 0) { state = {}; }
            var nextState = {};
            keys.forEach(function (key) {
                var currentModule = modules[key];
                var currentState = {};
                if (lodash_1.isFunction(currentModule.reducer)) {
                    if (currentModule.isRoot) {
                        currentState = state;
                        nextState = __assign(__assign({}, nextState), currentModule.reducer(currentState, action));
                    }
                    else {
                        currentState = state[key];
                        nextState[key] = currentModule.reducer(currentState, action);
                    }
                }
                else {
                    console.warn("reducer need be a function");
                }
            });
            return nextState;
        },
        initState,
    ];
}
exports.default = combineReducer;
