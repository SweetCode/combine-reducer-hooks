/*
 * @Author: sweet
 * @Date: 2021-04-19 14:14:17
 * @LastEditors: sweet
 * @LastEditTime: 2021-04-19 14:38:13
 * @Description: file content
 */

import { isFunction } from "lodash";

type Action<T> = {
  type: string;
  payload: T;
};

type Reducer<Payload> = {
  [key: string]: {
    initState: {};
    reducer: (currentState: object, action: Action<Payload>) => {};
    isRoot: boolean;
  };
};

/**
 * 合并reducer，适用于hooks
 */
function combineReducer<Payload>(modules: Reducer<Payload>) {
  let initState: any = {};
  let keys = Object.keys(modules);
  keys.forEach((key) => {
    let currentModule = modules[key];
    if (currentModule.isRoot) {
      initState = {
        ...initState,
        ...(currentModule.initState || {}),
      };
    } else {
      initState[key] = currentModule.initState || {};
    }
  });
  return [
    (state: { [key: string]: any } = {}, action: Action<Payload>) => {
      let nextState: { [key: string]: any } = {};
      keys.forEach((key) => {
        let currentModule = modules[key];
        let currentState = {};
        if (isFunction(currentModule.reducer)) {
          if (currentModule.isRoot) {
            currentState = state;
            nextState = {
              ...nextState,
              ...currentModule.reducer(currentState, action),
            };
          } else {
            currentState = state[key];
            nextState[key] = currentModule.reducer(currentState, action);
          }
        } else {
          console.warn("reducer need be a function");
        }
      });
      return nextState;
    },
    initState,
  ];
}

export default combineReducer;
