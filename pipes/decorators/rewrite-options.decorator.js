"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../decorators");
const validation_constants_1 = require("../validation.constants");
exports.RewriteOptions = (options) => decorators_1.SetMetadata(validation_constants_1.REWRITE_OPTIONS, options);
