import PortalIdParser from 'PortalIdParser';
import { createSlice } from '@reduxjs/toolkit';
import { getIsPortal53 } from '../widget-data/operators/getIsPortal53';
import { SPOTLIGHT } from 'conversations-internal-schema/widget-data/constants/launcherTypes';
import { getGates, getLauncherType } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { SPOTLIGHT_FORM_FACTOR_GATE } from '../widget-data/constants/gates';
import { receivedWidgetData } from '../actions/bootstrapWidget';

/**
 * @temporary Once the in-app help gate is deleted, a lot of this code can be removed
 * @expiration 2026-10-01
 * @deprecated
 */

const DEFAULT_WIDGET_SIZE = {
  width: 376,
  height: 530
};
const UPDATED_WIDGET_SIZE = {
  width: 416,
  height: 700
};
const SPOTLIGHT_WIDGET_SIZE = {
  width: 700,
  height: 600
};
const getWidgetHeight = (isSpotlight, shouldBeOverriden) => {
  if (isSpotlight) return SPOTLIGHT_WIDGET_SIZE.height;
  if (shouldBeOverriden) return DEFAULT_WIDGET_SIZE.height;
  return UPDATED_WIDGET_SIZE.height;
};
const initialState = {
  size: DEFAULT_WIDGET_SIZE,
  /**
   * @deprecated
   * Temporarily override the widget size for portal 44300118
   * until we implement the widget size setting.
   */
  shouldBeOverriden: getIsPortal53() || PortalIdParser.get() === 44300118,
  preferredSize: null
};
const widgetSizeSlice = createSlice({
  name: 'widgetSize',
  initialState,
  reducers: {
    setWidgetSize(state, action) {
      state.size = action.payload;
    },
    setPreferredWidgetSize(state, action) {
      state.preferredSize = action.payload;
    },
    /**
     * Set the widget size to the standard size (non-expanded) based on the user's gating.
     */

    setStandardWidgetSize(state) {
      const width = UPDATED_WIDGET_SIZE.width;
      const height = !state.shouldBeOverriden ? UPDATED_WIDGET_SIZE.height : DEFAULT_WIDGET_SIZE.height;
      state.size = {
        width,
        height
      };
    }
  },
  extraReducers: builder => {
    builder.addCase(receivedWidgetData, (state, action) => {
      const launcherType = getLauncherType(action.payload);
      const gates = getGates(action.payload);
      const isSpotlight = !!(gates !== null && gates !== void 0 && gates[SPOTLIGHT_FORM_FACTOR_GATE]) && launcherType === SPOTLIGHT;
      const width = isSpotlight ? SPOTLIGHT_WIDGET_SIZE.width : UPDATED_WIDGET_SIZE.width;
      const height = getWidgetHeight(isSpotlight, state.shouldBeOverriden);
      state.size = {
        width,
        height
      };
    });
  }
});
export const {
  setWidgetSize,
  setStandardWidgetSize,
  setPreferredWidgetSize
} = widgetSizeSlice.actions;
export default widgetSizeSlice.reducer;