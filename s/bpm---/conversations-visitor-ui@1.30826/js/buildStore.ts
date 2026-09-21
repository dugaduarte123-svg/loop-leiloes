import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

// @ts-ignore Untyped Dependency
import AgentResponseTimeoutMiddleware from './email-capture/middleware/AgentResponseTimeoutMiddleware';
// @ts-ignore Untyped Dependency
import VisitorLastSeenMiddleware from './last-seen/middleware/VisitorLastSeenMiddleware';
// @ts-ignore Untyped Dependency
import VisitorNotificationMiddleware from './middleware/VisitorNotificationMiddleware';
// @ts-ignore Untyped Dependency
import { visitorErrorMiddleware } from './error-reporting/middleware/visitorErrorMiddleware';
// @ts-ignore Untyped Dependency
import { realtime } from './pubsub/middleware/realtime';
import { INITIALIZE_PUBSUB } from 'conversations-internal-pub-sub/redux/constants/actionTypes';
import { messageEditorMiddleware } from './message-editor/middleware/messageEditorMiddleware';
import { interactiveCardTimeoutMiddleware } from './interactive-cards/middleware/interactiveCardTimeoutMiddleware';
import visitorUIRootReducer from './reducers/visitorUIRootReducer';
import { useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export default function buildStore(preloadedState, visitorIdentityContext) {
  const middleware = [thunk.withExtraArgument(visitorIdentityContext), visitorErrorMiddleware, VisitorLastSeenMiddleware, VisitorNotificationMiddleware, AgentResponseTimeoutMiddleware, realtime, messageEditorMiddleware, interactiveCardTimeoutMiddleware];
  return configureStore({
    reducer: visitorUIRootReducer,
    preloadedState,
    middleware,
    devTools: {
      maxAge: 200,
      serialize: {
        options: {
          // @ts-ignore Unknown type
          circular: '[CIRCULAR]'
        },
        immutable: Immutable
      },
      // Ably's client is quite large and serializing it slows down redux devtools
      actionSanitizer: action => {
        if (action.type === INITIALIZE_PUBSUB.SUCCEEDED) {
          return Object.assign({}, action, {
            payload: {
              client: '<< PUBSUB CLIENT >>'
            }
          });
        }
        return action;
      },
      stateSanitizer: state => {
        if (state.pubSubClient.data) {
          return Object.assign({}, state, {
            pubSubClient: state.pubSubClient.set('data', '<< PUBSUB CLIENT >>')
          });
        }
        return state;
      }
    }
  });
}