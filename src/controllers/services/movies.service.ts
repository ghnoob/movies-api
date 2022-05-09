import buildPaginator from 'pagination-apis';
import { Service } from 'typedi';
import Movie from '../../models/movie.model';
import PaginateDto from '../../models/dto/paginate.dto';

@Service()
export default class MoviesService {
  /**
   * Returns paginated list of all movies.
   */
  async findAll(dto: PaginateDto) {
    const { limit, skip, paginate } = buildPaginator({
      page: dto.page,
      limit: dto.limit,
      url: '/movies',
    });

    const { count, rows } = await Movie.findAndCountAll({
      attributes: ['id', 'title', 'imageUrl', 'createdAt'],
      limit,
      offset: skip,
    });

    return paginate(rows, count);
  }
}
