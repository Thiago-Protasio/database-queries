import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const filteredTitles = await this.repository.createQueryBuilder("games")
      .where("games.title ILIKE :p", { p: `%${param}%` })
      .getMany();

    if (!filteredTitles) {
      throw new Error("Title not found!");
    }

    return filteredTitles;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(`
      SELECT COUNT(id) 
      FROM games
    `);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository.createQueryBuilder("games")
      .relation(Game, "users")
      .of(id)
      .loadMany()
  }
}
