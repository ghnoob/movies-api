import buildPaginator from 'pagination-apis';
import { Service } from 'typedi';
import Character from '../../models/character.model';
import Genre from '../../models/genre.model';
import Movie from '../../models/movie.model';
import CreateMovieDto from '../../models/dto/movies/create-movie.dto';
import UpdateMovieDto from '../../models/dto/movies/update-movie.dto';
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

  /**
   * Retuns a movie by its id.
   */
  findOne(id: number): Promise<Movie | null> {
    return Movie.findByPk(id, {
      include: [
        {
          model: Character,
          attributes: ['id', 'name', 'imageUrl'],
          through: { attributes: [] },
        },
        {
          model: Genre,
        },
      ],
    });
  }

  /**
   * Creates a new movie and saves it to the database.
   *
   * @returns The id of the created movie.
   */
  create(dto: CreateMovieDto): Promise<Movie> {
    return Movie.create({ ...dto });
  }

  /**
   * Updates a movie.
   *
   * @returns The updated entity, or `null` if it was not found.
   */
  async update(id: number, dto: UpdateMovieDto): Promise<Movie | null> {
    const movie = await Movie.findByPk(id);

    if (movie) {
      movie.setAttributes(dto);
      await movie.save();
    }

    return movie;
  }

  /**
   * Deletes a movie.
   *
   * @returns The number of deleted movies (0 or 1).
   */
  delete(id: number): Promise<number> {
    return Movie.destroy({ where: { id }, limit: 1 });
  }
}
