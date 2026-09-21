"use strict";

require("prop-types");
require("react-addons-shallow-compare");
require("react-dom");
require("react-dom/client");
require("react-is");
require("react");
require("scheduler");
require("use-sync-external-store/with-selector");
if (process.env.NODE_ENV === 'production') {
  require('react/jsx-runtime');
} else {
  require('react/jsx-dev-runtime');
}