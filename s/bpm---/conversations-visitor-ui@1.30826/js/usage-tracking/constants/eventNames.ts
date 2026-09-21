export const EVENT_NAMESPACE = 'Conversations Visitor Ui';

//Derived from https://tools.hubteam.com/usage-library-ui/event-types?sort=eventType&owners=hs-live-chat-fe
export const EVENT_NAMES = {
  WIDGET_INTERACTION: 'Widget Interaction',
  PAGE_VIEW: 'Pageview',
  SEND_MESSAGE: 'Send Message',
  REPUBLISH_MESSAGE: 'Republish Message',
  PAGE_VIEW_FIFTY_THREE: 'Pageviewfiftythree',
  DRAGGED_WIDGET: 'Dragged Widget',
  START_CONVERSATION: 'Start Conversation',
  RESIZED_WIDGET: 'Resized Widget'
};
export const EVENT_KEYS = {
  START_CONVERSATION: 'start-conversation',
  SEND_MESSAGE: 'send-message',
  REPUBLISH_MESSAGE: 'republish-message',
  DRAGGED_WIDGET: 'dragged-widget',
  WIDGET_INTERACTION: 'widget-interaction',
  PAGE_VIEW: 'pageview',
  PAGE_VIEW_FIFTY_THREE: 'pageviewFiftyThree',
  ATTACHED_FILE: 'attached-file',
  FAILED_TO_ATTACH_FILE: 'failed-to-attach-file',
  RETRY_ATTACHMENT_UPLOAD: 'retry-attachment-upload',
  REMOVE_STAGED_ATTACHMENT: 'remove-staged-attachment',
  RESIZED_WIDGET: 'resized-widget'
};
export const EVENT_NAME_TO_KEY_MAPPING = {
  [EVENT_NAMES.WIDGET_INTERACTION]: EVENT_KEYS.WIDGET_INTERACTION,
  [EVENT_NAMES.PAGE_VIEW]: EVENT_KEYS.PAGE_VIEW,
  [EVENT_NAMES.SEND_MESSAGE]: EVENT_KEYS.SEND_MESSAGE,
  [EVENT_NAMES.REPUBLISH_MESSAGE]: EVENT_KEYS.REPUBLISH_MESSAGE,
  [EVENT_NAMES.PAGE_VIEW_FIFTY_THREE]: EVENT_KEYS.PAGE_VIEW_FIFTY_THREE,
  [EVENT_NAMES.DRAGGED_WIDGET]: EVENT_KEYS.DRAGGED_WIDGET,
  [EVENT_NAMES.START_CONVERSATION]: EVENT_KEYS.START_CONVERSATION,
  [EVENT_NAMES.RESIZED_WIDGET]: EVENT_KEYS.RESIZED_WIDGET
};
export const FEEDBACK_ACTIONS = {
  PROMPT_UPVOTED: 'prompt_upvoted',
  PROMPT_DOWNVOTED: 'prompt_downvoted',
  PROMPT_UPVOTE_REMOVED: 'prompt_upvote_removed',
  PROMPT_DOWNVOTE_REMOVED: 'prompt_downvote_removed'
};
export const EVENT_SAMPLE_RATES = {
  PAGE_VIEW: 0.1
};