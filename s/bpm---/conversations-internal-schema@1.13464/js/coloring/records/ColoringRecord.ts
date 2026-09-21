import { Record } from 'immutable';
const ColoringRecord = Record({
  accentColor: null,
  textColor: null,
  useDefaultColor: false
}, 'ColoringRecord');
export default ColoringRecord;