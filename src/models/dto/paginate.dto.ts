import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import Trim from '../../decorators/trim.decorator';

/**
 * Pagination options.
 */
export default class PaginateDto {
  @Expose()
  @IsOptional()
  @Trim()
  page?: string;

  @Expose()
  @IsOptional()
  @Trim()
  limit?: string;
}
