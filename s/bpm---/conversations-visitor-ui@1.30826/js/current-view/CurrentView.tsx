import { Suspense, PureComponent } from 'react';
import { THREAD_VIEW, THREAD_LIST, KNOWLEDGE_BASE, KNOWLEDGE_BASE_ARTICLE, CATEGORY_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import WidgetPlaceholder from 'conversations-visitor-experience-components/visitor-widget/components/WidgetPlaceholder';
// @ts-ignore untyped file
import VisitorWidgetContainer from '../visitor-widget/containers/VisitorWidgetContainer';
import { lazyWithPreload } from '../utils/lazyWithPreload';
import FadeSlideInTransition from '../transition/FadeSlideInTransition';
import { withBrowserSizeContext } from '../containers/withBrowserSizeContext';
import CategoryArticles from '../knowledge-base/components/CategoryArticles';
import KBArticleContainer from '../kb-article/components/KBArticleContainer';
import { postSdkCloseButtonClickEvent } from '../mobile-sdk/actions/postSdkCloseButtonClickEvent';
import { isInSDK } from 'visitor-ui-component-library/utils/isInSDK';
import { jsx as _jsx } from "react/jsx-runtime";
export class CurrentView extends PureComponent {
  constructor(props) {
    super(props);
    this.ThreadView = lazyWithPreload(() => import( /* webpackChunkName: "CurrentView-ThreadView" */'../components/ThreadView'));
    this.KnowledgeBaseContainer = lazyWithPreload(() => import( /* webpackChunkName: "CurrentView-KnowledgeBaseContainerV2" */'../knowledge-base/components/KnowledgeBaseContainerV2'));
    this.ThreadListContainer = lazyWithPreload(() => import( /* webpackChunkName: "CurrentView-ThreadListContainer" */'../containers/ThreadListContainer'));
  }
  renderView() {
    const {
      currentView
    } = this.props;
    if (!currentView) {
      return null;
    }
    switch (currentView) {
      case THREAD_VIEW:
        return /*#__PURE__*/_jsx(this.ThreadView, {
          onSetMessageTextExternally: this.props.onSetMessageTextExternally
        });
      case KNOWLEDGE_BASE:
        return /*#__PURE__*/_jsx(this.KnowledgeBaseContainer, {});
      case THREAD_LIST:
        return /*#__PURE__*/_jsx(this.ThreadListContainer, {});
      case CATEGORY_VIEW:
        return /*#__PURE__*/_jsx(CategoryArticles, {});
      case KNOWLEDGE_BASE_ARTICLE:
        return /*#__PURE__*/_jsx(KBArticleContainer, {});
      default:
        {
          return /*#__PURE__*/_jsx(WidgetPlaceholder, {});
        }
    }
  }
  renderContent() {
    const {
      closeWidget,
      browserWindowHeight,
      browserWindowWidth,
      inline,
      currentView,
      enableSdkCloseButton
    } = this.props;
    const isInSdk = isInSDK();
    let closeButtonClickHandler;
    if (enableSdkCloseButton) {
      closeButtonClickHandler = postSdkCloseButtonClickEvent;
    } else if (!(inline || isInSdk)) {
      closeButtonClickHandler = closeWidget;
    }
    return /*#__PURE__*/_jsx("div", {
      style: {
        height: '100%'
      },
      id: "current-view-component",
      children: /*#__PURE__*/_jsx(VisitorWidgetContainer, {
        browserWindowHeight: browserWindowHeight,
        browserWindowWidth: browserWindowWidth,
        closeWidget: closeButtonClickHandler,
        inline: inline,
        view: currentView,
        children: /*#__PURE__*/_jsx(Suspense, {
          fallback: /*#__PURE__*/_jsx(WidgetPlaceholder, {}),
          children: this.renderView()
        })
      })
    }, "widget");
  }
  render() {
    const {
      onOpenAnimationStarted,
      onCloseAnimationStarted,
      onOpenAnimationFinished,
      onCloseAnimationFinished,
      isOpen,
      usePillLauncher
    } = this.props;
    return /*#__PURE__*/_jsx(FadeSlideInTransition, {
      addEndListener: () => {},
      duration: usePillLauncher ? 0 : 500,
      in: isOpen || false,
      onEnter: onOpenAnimationStarted,
      onEntered: onOpenAnimationFinished,
      onExit: onCloseAnimationStarted,
      onExited: onCloseAnimationFinished,
      children: this.renderContent()
    });
  }
}
CurrentView.displayName = 'CurrentView';
CurrentView.defaultProps = {
  onOpenAnimationFinished: () => {},
  onOpenAnimationStarted: () => {},
  onCloseAnimationFinished: () => {},
  onCloseAnimationStarted: () => {}
};
export default withBrowserSizeContext(CurrentView);