import { Service } from 'typedi';
import CreateCharacterDto from '../../models/dto/characters/create-character.dto';
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
}
