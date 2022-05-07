import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

/**
 * Pagination options.
 */
export default class PaginateDto {
  @Expose()
  @IsOptional()
  page?: string;

  @Expose()
  @IsOptional()
  limit?: string;
}
