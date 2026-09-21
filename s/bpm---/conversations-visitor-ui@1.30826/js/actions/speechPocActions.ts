export const SET_SPEECH_POC_ACTIVE = 'SET_SPEECH_POC_ACTIVE';
export const SET_AUDIO_PLAYBACK_STATUS = 'SET_AUDIO_PLAYBACK_STATUS';
export const SET_SPEECH_RECORDING_STATUS = 'SET_SPEECH_RECORDING_STATUS';
export const setSpeechPocActive = isActive => ({
  type: SET_SPEECH_POC_ACTIVE,
  payload: isActive
});
export const setAudioPlaybackStatus = status => ({
  type: SET_AUDIO_PLAYBACK_STATUS,
  payload: status
});
export const setSpeechRecordingStatus = status => ({
  type: SET_SPEECH_RECORDING_STATUS,
  payload: status
});