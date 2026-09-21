'use es6';

/*
 * Copyright 2024 Google LLC
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
export class LCPEntryManager {
    constructor() {
        this._onBeforeProcessingEntry = void 0;
        this._softNavigationEntryMap = void 0;
    }
    _processEntry(entry) {
        var _this$_onBeforeProces;
        (_this$_onBeforeProces = this._onBeforeProcessingEntry) === null || _this$_onBeforeProces === void 0 || _this$_onBeforeProces.call(this, entry);
    }
}