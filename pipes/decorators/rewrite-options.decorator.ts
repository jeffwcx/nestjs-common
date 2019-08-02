import { SetMetadata } from '../../decorators';
import { ValidatorOptions } from '../../interfaces/external/validator-options.interface';
import { REWRITE_OPTIONS } from '../validation.constants';

export const RewriteOptions = (options: ValidatorOptions) =>
  SetMetadata(REWRITE_OPTIONS, options);
