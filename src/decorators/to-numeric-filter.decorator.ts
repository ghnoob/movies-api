import { Transform, TransformOptions } from 'class-transformer';
import NumericFilter from '../models/types/numeric-filter.type';

/**
 * Transforms a value to an object of type NumericFilter.
 */
export default function ToNumericFilter(options?: TransformOptions) {
  return Transform(({ value }): NumericFilter => {
    if (value == null) {
      return value;
    }

    if (!isNaN(value)) {
      return { eq: Number(value) };
    }

    // if it is an array, use first element
    if (Array.isArray(value) && value.length > 0) {
      const [item] = value;

      return { eq: !isNaN(item) ? Number(item) : null };
    }

    const result: NumericFilter = {};

    const KEYS = ['eq', 'lt', 'gt', 'lte', 'gte'] as const;

    KEYS.forEach((key) => {
      let val = value[key];

      if (val != null) {
        // if it is an array, use first element
        if (Array.isArray(val) && val.length > 0) {
          val = val[0];
        }

        result[key] = !isNaN(val) ? Number(val) : null;
      }
    });

    return result;
  }, options);
}
