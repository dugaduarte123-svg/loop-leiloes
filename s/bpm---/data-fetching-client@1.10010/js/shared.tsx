import { useContext, createContext, useMemo } from 'react';
import { useQuery as useApolloQuery, useMutation as useApolloMutation, useLazyQuery as useLazyApolloQuery, useSuspenseQuery as useApolloSuspenseQuery, useBackgroundQuery as useApolloBackgroundQuery, useReadQuery as useApolloReadQuery, useQueryRefHandlers, useLoadableQuery, ApolloLink, ApolloClient, InMemoryCache, fromPromise, split, Observable } from '@apollo/client';
import { getOperationDocument } from './getOperationDocument';
import stringify from 'fast-json-stable-stringify';
import { Metrics } from './metrics';
import { jsx as _jsx } from "react/jsx-runtime";
export const contextKey = Symbol.for('__DATA_FETCHING_CLIENT_CONTEXT__');

// Memoized context creation using the `createContext` function as a cache. Following a pattern from Apollo Client
function getDataFetchingClientContext() {
  let context = createContext[contextKey];
  if (!context) {
    context = /*#__PURE__*/createContext({});
    Object.defineProperty(createContext, contextKey, {
      value: context,
      enumerable: false,
      writable: false,
      configurable: true
    });
    context.displayName = 'DataFetchingClientContext';
  }
  return context;
}
function useDataFetchingClient(throwIfMissing) {
  const {
    client
  } = useContext(getDataFetchingClientContext());

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  if (throwIfMissing !== false && process.env.NODE_ENV !== 'production') {
    if (!client) {
      throw new Error('Cannot find context. Did you forget to configure `DataFetchingClientProvider`');
    }
  }
  return client;
}
function DataFetchingClientProvider({
  client,
  children
}) {
  const clientValue = useMemo(() => ({
    client
  }), [client]);
  const DataFetchingClientContext = getDataFetchingClientContext();
  return /*#__PURE__*/_jsx(DataFetchingClientContext.Provider, {
    value: clientValue,
    children: children
  });
}

// See https://spec.graphql.org/June2018/#sec-Names
const isValidGraphQLName = str => typeof str === 'string' && /^[_A-Za-z][_0-9A-Za-z]+$/.test(str);
const registeredQueries = new WeakMap();
const registeredStreams = new WeakMap();
const getFieldName = operation => {
  var _registeredQueries$ge;
  const registeredOperation = (_registeredQueries$ge = registeredQueries.get(operation)) !== null && _registeredQueries$ge !== void 0 ? _registeredQueries$ge : registeredStreams.get(operation);
  if (!registeredOperation) {
    throw new Error('`data-fetching-client` only supports queries, mutations, or streams created with `registerQuery`, `registerMutation`, or `registerStream`.');
  }
  return registeredOperation.fieldName;
};
class DataFetchingClientStreamingLink extends ApolloLink {
  constructor({
    client
  }) {
    super();
    this.streams = new Map();
    this.client = client;
  }
  request({
    variables,
    query,
    getContext
  }) {
    const context = getContext();
    const streamDef = registeredStreams.get(query);
    if (!streamDef) {
      throw new Error('`data-fetching-client` only supports streams created with `registerStream`.');
    }
    Metrics.counter('network-request', {
      operationType: 'stream'
    }).increment();
    const {
      startStream,
      handleMessage,
      fieldName
    } = streamDef;
    const streamId = `${fieldName}-${stringify(variables)}`;
    const read = () => {
      var _this$client$cache$re;
      return (_this$client$cache$re = this.client.cache.readQuery({
        query,
        variables
      })) === null || _this$client$cache$re === void 0 ? void 0 : _this$client$cache$re[fieldName];
    };
    return new Observable(observer => {
      var _this$streams$get;
      let didClean = false;
      (_this$streams$get = this.streams.get(streamId)) === null || _this$streams$get === void 0 || _this$streams$get();

      // Start the new stream
      const handler = startStream(variables, Object.assign({}, context, {
        client: this.client
      }));
      const cleanup = () => {
        var _read;
        if (didClean) {
          return;
        }
        didClean = true;
        handler.abort();
        observer.complete();

        // If we cleaned up before the stream completed,
        // wipe out the cache for next time
        if ((_read = read()) !== null && _read !== void 0 && _read.loading) {
          this.client.cache.evict({
            fieldName,
            args: variables,
            broadcast: true
          });
        }
        this.streams.delete(streamId);
      };
      this.streams.set(streamId, cleanup);
      const cleanGuard = fn => (...args) => {
        if (!didClean) {
          fn(...args);
        }
      };
      const next = data => observer.next({
        data: {
          [fieldName]: data
        }
      });
      next({
        result: undefined,
        loading: true
      });
      void handler.onMessage(cleanGuard(message => {
        var _read2;
        next({
          result: handleMessage({
            current: (_read2 = read()) === null || _read2 === void 0 ? void 0 : _read2.result,
            message
          }),
          loading: true
        });
      })).then(cleanGuard(() => {
        var _read3;
        next({
          result: (_read3 = read()) === null || _read3 === void 0 ? void 0 : _read3.result,
          loading: false
        });
        observer.complete();
      })).catch(cleanGuard(err => {
        var _read4;
        next({
          result: (_read4 = read()) === null || _read4 === void 0 ? void 0 : _read4.result,
          loading: false
        });
        observer.error(err);
      }));
      return cleanup;
    });
  }
}
class DataFetchingClientLink extends ApolloLink {
  constructor({
    client
  }) {
    super();
    this.client = client;
  }
  request(operation) {
    var _operationDefinition$;
    const {
      variables,
      query,
      getContext
    } = operation;
    const context = getContext();
    const fieldDef = registeredQueries.get(query);
    if (!fieldDef) {
      throw new Error('`data-fetching-client` only supports queries created with `registerQuery` or `registerMutation`.');
    }
    const {
      fetcher,
      fieldName,
      withResultAlias
    } = fieldDef;
    const operationDefinition = query.definitions.find(def => def.kind === 'OperationDefinition');
    Metrics.counter('network-request', {
      operationType: (_operationDefinition$ = operationDefinition === null || operationDefinition === void 0 ? void 0 : operationDefinition.operation) !== null && _operationDefinition$ !== void 0 ? _operationDefinition$ : 'query'
    }).increment();
    return fromPromise(new Promise((resolve, reject) => {
      try {
        resolve(fetcher(variables, Object.assign({}, context, {
          client: this.client
        })));
      } catch (error) {
        reject(error);
      }
    })).map(result => ({
      data: {
        [withResultAlias ? 'result' : fieldName]: result
      }
    }));
  }
}
function createFetcherRejectionLink(onFetcherRejection) {
  return new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      const sub = forward(operation).subscribe({
        next(result) {
          observer.next(result);
        },
        error(err) {
          observer.error(err);
          onFetcherRejection(err, getOperationInfo(operation));
        },
        complete() {
          observer.complete();
        }
      });
      return () => {
        sub.unsubscribe();
      };
    });
  });
}
function getOperationInfo(operation) {
  const operationDefinition = operation.query.definitions.find(def => def.kind === 'OperationDefinition');
  if (!operationDefinition || !(operationDefinition.operation === 'query' || operationDefinition.operation === 'mutation')) {
    throw new Error('Could not determine operation info');
  }
  return {
    operationType: operationDefinition.operation,
    fieldName: getFieldName(operation.query),
    variables: operation.variables
  };
}
class DataFetchingClient extends ApolloClient {
  constructor({
    queryFieldPolicies,
    mutationFieldPolicies,
    assumeImmutableResults,
    defaultOptions,
    connectToDevTools,
    onFetcherRejection
  } = {}) {
    super({
      defaultOptions,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: Object.assign({}, queryFieldPolicies)
          },
          Mutation: {
            fields: Object.assign({}, mutationFieldPolicies)
          }
        },
        addTypename: false
      }),
      assumeImmutableResults,
      connectToDevTools
    });
    const queryMutationLink = onFetcherRejection ? ApolloLink.from([createFetcherRejectionLink(onFetcherRejection), new DataFetchingClientLink({
      client: this
    })]) : new DataFetchingClientLink({
      client: this
    });
    const streamingLink = new DataFetchingClientStreamingLink({
      client: this
    });
    this.setLink(split(({
      query
    }) => registeredStreams.has(query), streamingLink, queryMutationLink));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    if (process.env.NODE_ENV !== 'production') {
      window.__DATA_FETCHING_CLIENT__ = this;
    }
  }
}
function registerOperation(operation, {
  fieldName,
  args = [],
  fetcher
}, withResultAlias) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  if (process.env.NODE_ENV !== 'production') {
    if (!isValidGraphQLName(fieldName)) {
      throw new Error(`"${fieldName}" is not a valid GraphQL Name and cannot be used as \`fieldName\`. https://spec.graphql.org/June2018/#sec-Names`);
    }
    args.forEach(arg => {
      if (!isValidGraphQLName(arg)) {
        throw new Error(`"${String(arg)}" is not a valid GraphQL Name and cannot be used in \`args\`. https://spec.graphql.org/June2018/#sec-Names`);
      }
    });
  }
  const query = getOperationDocument({
    operation,
    fieldName,
    args,
    withResultAlias,
    useClientDirective: fetcher === undefined
  });
  registeredQueries.set(query, {
    fetcher,
    withResultAlias,
    fieldName
  });
  return query;
}
function registerQuery(options) {
  return registerOperation('query', options, false);
}
function registerMutation(options) {
  return registerOperation('mutation', options, false);
}
const defaultHandleMessage = ({
  current = [],
  message
}) => [...current, message];

// Overload: without handleMessage, accumulates to TMessage[]

// Overload: with handleMessage, derives TAccumulated from return type

// Implementation
function registerStream({
  fieldName,
  args = [],
  startStream,
  handleMessage = defaultHandleMessage
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  if (process.env.NODE_ENV !== 'production') {
    if (!isValidGraphQLName(fieldName)) {
      throw new Error(`"${fieldName}" is not a valid GraphQL Name and cannot be used as \`fieldName\`. https://spec.graphql.org/June2018/#sec-Names`);
    }
    args.forEach(arg => {
      if (!isValidGraphQLName(arg)) {
        throw new Error(`"${String(arg)}" is not a valid GraphQL Name and cannot be used in \`args\`. https://spec.graphql.org/June2018/#sec-Names`);
      }
    });
  }
  const query = getOperationDocument({
    operation: 'query',
    fieldName,
    args
  });
  registeredStreams.set(query, {
    fieldName,
    startStream,
    handleMessage
  });
  return query;
}
function useQuery(query, options) {
  const {
    client
  } = useContext(getDataFetchingClientContext());
  return useApolloQuery(query, Object.assign({
    client
  }, options));
}
function useLazyQuery(query, options) {
  const {
    client
  } = useContext(getDataFetchingClientContext());
  return useLazyApolloQuery(query, Object.assign({
    client
  }, options));
}
function useMutation(query, options) {
  const {
    client
  } = useContext(getDataFetchingClientContext());
  return useApolloMutation(query, Object.assign({
    client
  }, options));
}
function useSuspenseQuery(query, options) {
  const client = useDataFetchingClient();
  const queryKey = options !== null && options !== void 0 && options.skip && (options === null || options === void 0 ? void 0 : options.queryKey) == null ? 'skip:true' : options === null || options === void 0 ? void 0 : options.queryKey;
  return useApolloSuspenseQuery(query, Object.assign({
    client
  }, options, {
    queryKey
  }));
}
function useBackgroundQuery(query, options) {
  const client = useDataFetchingClient();
  return useApolloBackgroundQuery(query, Object.assign({
    client
  }, options));
}
function useReadQuery(queryRef) {
  if (!queryRef) {
    throw new Error('useReadQuery must be called with a query ref. If you are using `skip`, this component should be conditionally rendered.');
  }
  return useApolloReadQuery(queryRef);
}
export { getDataFetchingClientContext, DataFetchingClientProvider, DataFetchingClient, registerQuery, registerMutation, registerOperation, registerStream, useDataFetchingClient, useQuery, useLazyQuery, useMutation, useSuspenseQuery, useBackgroundQuery, useReadQuery, useQueryRefHandlers, useLoadableQuery, getFieldName };