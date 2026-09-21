'use es6';

/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    getNavigationEntry
} from './getNavigationEntry.js';
export const getActivationStart = () => {
    var _getNavigationEntry$a, _getNavigationEntry;
    return (_getNavigationEntry$a = (_getNavigationEntry = getNavigationEntry()) === null || _getNavigationEntry === void 0 ? void 0 : _getNavigationEntry.activationStart) !== null && _getNavigationEntry$a !== void 0 ? _getNavigationEntry$a : 0;
};