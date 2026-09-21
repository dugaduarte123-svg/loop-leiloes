import { emptyChangeContext } from '../../client/changeManager';
import { toLoading } from '../../resolvers/definition/resolverState';
export const createEntry = ({
  state,
  meta
}) => ({
  state,
  meta: Object.assign({
    changeContext: emptyChangeContext,
    visible: true
  }, meta)
});
export const createEmptyEntry = (params, paramLinkTags, changeContext = emptyChangeContext) => createEntry({
  state: toLoading()(),
  meta: {
    params,
    paramLinkTags,
    changeContext
  }
});