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
   * @returns The updated entity, or `null` if it was not found.
   */
  async update(id: number, dto: UpdateCharacterDto): Promise<Character | null> {
    const character = await Character.findOne({ where: { id } });

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
    return Character.destroy({ where: { id } });
  }
}
