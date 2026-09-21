// @ts-ignore Untyped import
import autolinker from 'autolinker';
// @ts-ignore Untyped import
import { escape } from 'conversations-message-history/util/escape';
export const buildRichText = text => `<div>${autolinker.link(escape(text), {
  stripPrefix: false
})}</div>`.replace(/\n/g, '<br>');