import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import NormalizeQueryParamString from '../../../decorators/normalize-query-param-string.decorator';
import ToNumericFilter from '../../../decorators/to-numeric-filter.decorator';
import Trim from '../../../decorators/trim.decorator';
import NumericFilter from '../../types/numeric-filter.type';
import PaginateDto from '../paginate.dto';

export default class FilterCharacterDto extends PaginateDto {
  @Expose()
  @IsOptional()
  @Trim()
  @NormalizeQueryParamString()
  name?: string;

  @Expose()
  @IsOptional()
  @ToNumericFilter()
  age?: NumericFilter;

  @Expose()
  @IsOptional()
  @ToNumericFilter()
  weight?: NumericFilter;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) {
      return value;
    }

    const ids: Array<number | null> = [];

    return ids.concat(value).map((item: unknown) => {
      const asNumber = Number(item);
      return !Number.isNaN(asNumber) ? asNumber : null;
    });
  })
  movies?: Array<number | null>;
}
