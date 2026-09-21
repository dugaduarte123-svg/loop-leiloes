import { SET_SPEECH_POC_ACTIVE, SET_AUDIO_PLAYBACK_STATUS, SET_SPEECH_RECORDING_STATUS } from '../actions/speechPocActions';
const initialState = {
  speechPocActive: false,
  audioPlaybackStatus: 'paused',
  speechRecordingStatus: 'idle'
};
export const speechPocReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPEECH_POC_ACTIVE:
      return Object.assign({}, state, {
        speechPocActive: action.payload
      });
    case SET_AUDIO_PLAYBACK_STATUS:
      return Object.assign({}, state, {
        audioPlaybackStatus: action.payload
      });
    case SET_SPEECH_RECORDING_STATUS:
      return Object.assign({}, state, {
        speechRecordingStatus: action.payload
      });
    default:
      return state;
  }
};