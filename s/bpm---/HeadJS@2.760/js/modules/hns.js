/* hs-eslint ignored failing-rules */
/* eslint-disable vars-on-top */
/* eslint-disable one-var */

/*eslint-env node, browser */

var globalRoot;

if (typeof window !== 'undefined' && window !== null) {
    globalRoot = window;
} else if (typeof global !== 'undefined' && global !== null) {
    globalRoot = global;
} else {
    globalRoot = this;
}

// Assigns the object passed in to the global identifier hs.namespace.namespace.object.
// If the namespace and/or object already exist, it will extend, preserving existing
// data.
//
//   ns - namespace (expects dot-separated list -- something like 'hubspot.analytics.campaigns')
//   ext - (optional, can be hash or function)-- each property will be copied into namespace
//
// Usage:
//   hns('hs.namespace.namespace.object', {
//     name: 'value'
//   });
//
// Note, this does not recursively copy the original object, so that there aren't problems
// accessing attributes that are set at runtime.
var hns =
    (globalRoot.hns =
        globalRoot.hns2 =
        function(namespace, obj) {
            var parts = namespace.split('.'),
                parent = globalRoot,
                name = '',
                var_name,
                last_index = parts.length - 1,
                existing,
                queue,
                front;

            obj = obj || {};
            var_name = parts[last_index];

            // Create any non-existant objects in the namespace path
            for (var x = 0; x < last_index; x++) {
                name = parts[x];
                parent[name] = parent[name] || {};
                parent = parent[name];
            }

            // Start merge if the namespace already existed
            if (parent[var_name] && obj !== parent[var_name]) {
                existing = parent[var_name];
                queue = [];

                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        // If we are merging an object, keep track of each level in a
                        // queue and ensure we merge from the "outside in" to prevent clobbering
                        if (typeof existing[prop] === 'object') {
                            if (obj[prop] !== existing[prop]) {
                                queue.push({
                                    qSource: obj[prop],
                                    qTarget: existing[prop]
                                });
                            }

                            while (queue.length > 0) {
                                front = queue.shift();

                                for (var fprop in front.qSource) {
                                    if (front.qSource.hasOwnProperty(fprop)) {
                                        // Skip HTML entity attributes as the browser doesn't like it when we try to copy them
                                        if (
                                            typeof front.qSource[fprop] === 'object' &&
                                            typeof front.qTarget[fprop] === 'object' &&
                                            (!front.qSource[fprop] ||
                                                front.qSource[fprop].classList === void 0 ||
                                                front.qSource[fprop].nodeType === void 0)
                                        ) {
                                            if (front.qSource[fprop] !== front.qTarget[fprop]) {
                                                queue.push({
                                                    qSource: front.qSource[fprop],
                                                    qTarget: front.qTarget[fprop],
                                                });
                                            }
                                        } else {
                                            front.qTarget[fprop] = front.qSource[fprop];
                                        }
                                    }
                                }
                            }
                        } else {
                            existing[prop] = obj[prop];
                        }
                    }
                }

                // Otherwise, simply assign to the new namespace
            } else {
                parent[var_name] = obj;
            }

            // define any other modules that depended on this module
            if (typeof hubspot !== 'undefined' && hubspot.updateDependencies) {
                hubspot.updateDependencies(namespace);
            }

            return parent[var_name];
        });

// setup our top level namespace
hns('hubspot');