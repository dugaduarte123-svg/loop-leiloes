import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["messages", "directReplies", "friendlyNameResults", "replyRecommendations"];
import { Record, Map as ImmutableMap, OrderedMap } from 'immutable';
import { buildDirectReplies } from '../operators/buildDirectReplies';
import { createReplyRecsHistoryEntry } from '../operators/createReplyRecsHistoryEntry';
import ThreadHistoryMessages from './ThreadHistoryMessages';
/**
 * Message History for a Thread
 *
 * @param {Object} properties The properties to build the ThreadHistory with
 * @param {Map} properties.messages
 * @param {Iterable} properties.messages.results An iterable list of messages
 * @param {Boolean} properties.messages.hasMore Whether a threadHistory has more messages to fetch
 * @param {Object} properties.messages.offset Contains pagination offset information
 * @param {Number} properties.messages.offset.timestamp
 * @param {Number} properties.messages.offset.ordinal
 * @param {Number} properties.visitorLastReadAtTimestamp
 * @param {Number} properties.numSoftDeletedMessages
 * @param {Map} properties.attachments A Map of all of the attachments for the viewable thread
 */
class ThreadHistory extends Record({
  messages: new ThreadHistoryMessages({
    results: OrderedMap(),
    hasMore: false,
    //https://git.hubteam.com/HubSpot/context-and-collab-projects/issues/297
    //TODO: Remove once cutover to new offset is complete
    offset: ImmutableMap()
  }),
  visitorLastReadAtTimestamp: 0,
  numSoftDeletedMessages: 0,
  attachments: ImmutableMap(),
  directReplies: ImmutableMap(),
  friendlyNameResults: [],
  replyRecommendationsHistory: {}
}, 'ThreadHistory') {
  constructor(properties = {}) {
    // properties.messages should be transformed and not leaked
    const {
        messages = {
          results: OrderedMap(),
          hasMore: false,
          offset: ImmutableMap()
        },
        directReplies = ImmutableMap(),
        friendlyNameResults = [],
        replyRecommendations
      } = properties,
      remainingProperties = _objectWithoutPropertiesLoose(properties, _excluded);
    super(Object.assign({}, remainingProperties, {
      messages: new ThreadHistoryMessages(messages),
      directReplies: buildDirectReplies(directReplies),
      friendlyNameResults,
      replyRecommendationsHistory: createReplyRecsHistoryEntry(replyRecommendations)
    }));
  }
}
export default ThreadHistory;