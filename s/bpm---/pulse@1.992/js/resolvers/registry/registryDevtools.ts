export const registryDevtools = registeredResolvers => ({
  resolverRegistry: {
    getRegisteredResolvers: () => Object.fromEntries([...registeredResolvers.entries()].map(([typeName, resolver]) => [typeName, {
      name: resolver.name,
      tags: resolver.tags
    }]))
  }
});