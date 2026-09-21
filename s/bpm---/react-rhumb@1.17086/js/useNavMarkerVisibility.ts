import { useContext, useEffect } from 'react';
import RhumbContext from './internal/RhumbContext';
const useIsNavMarkerVisible = (name, ref) => {
  const context = useContext(RhumbContext);
  useEffect(() => {
    if (!context || !context.trackVisibility || typeof context.dispatch !== 'function') {
      return;
    }
    const {
      id,
      dispatch
    } = context;
    dispatch({
      type: 'ADD_MARKER_REF',
      payload: {
        marker: {
          name,
          id
        },
        ref
      }
    });
  }, [context, name, ref]);
};
export default useIsNavMarkerVisible;