import { Service } from 'typedi';
import CreateCharacterDto from '../../models/dto/characters/create-character.dto';
import UpdateCharacterDto from '../../models/dto/characters/update-character.dto';
import Character from '../../models/character.model';

/**
 * Helper methods for `CharactersController`.
 */
@Service()
export default class CharactersService {
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
   * @returns An array with the number o affected db rows.
   */
  update(
    id: number,
    dto: UpdateCharacterDto,
  ): Promise<[affectedCount: number]> {
    return Character.update({ ...dto }, { where: { id } });
  }

  /**
   * Deletes a character.
   *
   * @returns The number of deleted characters (0 or 1).
   */
  delete(id: number): Promise<number> {
    return Character.destroy({ where: { id } });
  }
}
