import { Record } from 'immutable';
import { LOCATION } from '../constants/attachmentTypes';
const LocationMetadata = Record({
  '@type': LOCATION,
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
  url: ''
}, 'LocationMetadata');
export default LocationMetadata;