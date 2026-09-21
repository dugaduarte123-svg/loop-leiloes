export const getOperationDocument = ({
  operation,
  fieldName,
  args,
  withResultAlias = false,
  useClientDirective = false
}) => ({
  kind: 'Document',
  definitions: [{
    kind: 'OperationDefinition',
    operation,
    name: {
      kind: 'Name',
      value: fieldName
    },
    variableDefinitions: args.map(arg => ({
      kind: 'VariableDefinition',
      variable: {
        kind: 'Variable',
        name: {
          kind: 'Name',
          value: arg
        }
      },
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'JSON'
        }
      }
    })),
    selectionSet: {
      kind: 'SelectionSet',
      selections: [{
        kind: 'Field',
        name: {
          kind: 'Name',
          value: fieldName
        },
        alias: withResultAlias ? {
          kind: 'Name',
          value: 'result'
        } : undefined,
        directives: useClientDirective ? [{
          kind: 'Directive',
          name: {
            kind: 'Name',
            value: 'client'
          }
        }] : [],
        arguments: args.map(arg => ({
          kind: 'Argument',
          name: {
            kind: 'Name',
            value: arg
          },
          value: {
            kind: 'Variable',
            name: {
              kind: 'Name',
              value: arg
            }
          }
        }))
      }]
    }
  }]
});