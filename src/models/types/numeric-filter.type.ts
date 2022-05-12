/**
 * For filtering number properties, for example, age.
 */
type NumericFilter = {
  /**
   * 'Equals' filter.
   */
  eq?: number | null;

  /**
   * 'Less than' filter.
   */
  lt?: number | null;

  /**
   * 'Greater than' filter.
   */
  gt?: number | null;

  /**
   * 'Less or equal than' filter.
   */
  lte?: number | null;

  /**
   * 'Greater or equal than' filter.
   */
  gte?: number | null;
};

export default NumericFilter;
