import { ModuleMetadata } from '../../interfaces/modules/module-metadata.interface';
/**
 * Defines the module
 * - `imports` - the set of the 'imported' modules
 * - `controllers` - the list of controllers (e.g. HTTP controllers)
 * - `providers` - the list of providers that belong to this module. They can be injected between themselves.
 * - `exports` - the set of components, which should be available for modules, which imports this module
 * @param metadata {ModuleMetadata} Module metadata
 */
export declare function Module(metadata: ModuleMetadata): ClassDecorator;
