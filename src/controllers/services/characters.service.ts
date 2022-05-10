import buildPaginator from 'pagination-apis';
import { Service } from 'typedi';
import CreateCharacterDto from '../../models/dto/characters/create-character.dto';
import UpdateCharacterDto from '../../models/dto/characters/update-character.dto';
import PaginateDto from '../../models/dto/paginate.dto';
import Character from '../../models/character.model';
import Movie from '../../models/movie.model';

/**
 * Helper methods for `CharactersController`.
 */
@Service()
export default class CharactersService {
  /**
   * Returns paginated list of all characters.
   */
  async findAll(dto: PaginateDto) {
    const { limit, skip, paginate } = buildPaginator({
      page: dto.page,
      limit: dto.limit,
      url: '/characters',
    });

    const { count, rows } = await Character.findAndCountAll({
      attributes: ['id', 'name', 'imageUrl'],
      limit,
      offset: skip,
    });

    return paginate(rows, count);
  }

  /**
   * Retuns a character by its id.
   */
  findOne(id: number): Promise<Character | null> {
    return Character.findByPk(id, {
      include: {
        model: Movie,
        attributes: ['id', 'title', 'imageUrl'],
        through: { attributes: [] },
      },
    });
  }

  /**
   * Creates a new character and saves it to the database.
   *
   * @returns The created character.
   */
  create(dto: CreateCharacterDto): Promise<Character> {
    return Character.create({ ...dto });
  }

  /**
   * Updates a character.
   *
   * @returns The updated entity, or `null` if it was not found.
   */
  async update(id: number, dto: UpdateCharacterDto): Promise<Character | null> {
    const character = await Character.findByPk(id);

    if (character) {
      character.setAttributes(dto);
      await character.save();
    }

    return character;
  }

  /**
   * Deletes a character.
   *
   * @returns The number of deleted characters (0 or 1).
   */
  delete(id: number): Promise<number> {
    return Character.destroy({ where: { id }, limit: 1 });
  }
}
