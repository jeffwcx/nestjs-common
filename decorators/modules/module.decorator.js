"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const invalid_module_config_exception_1 = require("./exceptions/invalid-module-config.exception");
const metadataKeys = [
    constants_1.METADATA.IMPORTS,
    constants_1.METADATA.EXPORTS,
    constants_1.METADATA.CONTROLLERS,
    constants_1.METADATA.PROVIDERS,
];
const validateKeys = (keys) => {
    const validateKey = (key) => {
        if (metadataKeys.includes(key)) {
            return;
        }
        throw new invalid_module_config_exception_1.InvalidModuleConfigException(key);
    };
    keys.forEach(validateKey);
};
/**
 * Defines the module
 * - `imports` - the set of the 'imported' modules
 * - `controllers` - the list of controllers (e.g. HTTP controllers)
 * - `providers` - the list of providers that belong to this module. They can be injected between themselves.
 * - `exports` - the set of components, which should be available for modules, which imports this module
 * @param metadata {ModuleMetadata} Module metadata
 */
function Module(metadata) {
    const propsKeys = Object.keys(metadata);
    validateKeys(propsKeys);
    return (target) => {
        for (const property in metadata) {
            if (metadata.hasOwnProperty(property)) {
                Reflect.defineMetadata(property, metadata[property], target);
            }
        }
    };
}
exports.Module = Module;
