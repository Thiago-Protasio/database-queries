import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1616108470200 implements MigrationInterface {
  name = 'migration1616108470200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "orderId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "users_games_games" ("usersId" uuid NOT NULL, "gamesId" uuid NOT NULL, CONSTRAINT "PK_cd4067d574477fd5c7693bc7872" PRIMARY KEY ("usersId", "gamesId"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_e5263d029d8644de829aae5c35" ON "users_games_games" ("usersId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_934b0d8f9d0084c97d3876ad32" ON "users_games_games" ("gamesId") ',
    );
    await queryRunner.query(
      'ALTER TABLE "users_games_games" ADD CONSTRAINT "FK_e5263d029d8644de829aae5c35a" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "users_games_games" ADD CONSTRAINT "FK_934b0d8f9d0084c97d3876ad32d" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );

    // table genres (many-to-many)
    await queryRunner.query(
      'CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_395dba6884988f89f2eececaa60" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "games_genres" ("gamesId" uuid NOT NULL, "genresId" uuid NOT NULL, CONSTRAINT "PK_5281642b147b31c2f27e7ccf8f9" PRIMARY KEY ("gamesId", "genresId"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_3ad46e27e490997c86f4039fd5e" ON "games_genres" ("gamesId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_7e87e404cce47120f52c505330c" ON "games_genres" ("genresId")',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres" ADD CONSTRAINT "FK_3ad46e27e490997c86f4039fd5e" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres" ADD CONSTRAINT "FK_7e87e404cce47120f52c505330c" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );

    // table orders
    await queryRunner.query(
      'CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gamesId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),CONSTRAINT "PK_e3290b4e0be97c9c48972c742af" PRIMARY KEY ("id"))',
    );

    // Relation orders-games (one-to-many)
    await queryRunner.query(
      'CREATE INDEX "IDX_1981015e945776533ec5af88154" ON "games" ("id")',
    );

    await queryRunner.query(
      'ALTER TABLE "orders" ADD CONSTRAINT "FK_1981015e945776533ec5af88154" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );

    // Relation orders-users

    await queryRunner.query(
      'CREATE INDEX "IDX_952b6fda2e51bdbc38c74b20102" ON "orders" ("id")',
    );

    await queryRunner.query(
      'ALTER TABLE "users" ADD CONSTRAINT "FK_952b6fda2e51bdbc38c74b20102" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users_games_games" DROP CONSTRAINT "FK_934b0d8f9d0084c97d3876ad32d"',
    );
    await queryRunner.query(
      'ALTER TABLE "users_games_games" DROP CONSTRAINT "FK_e5263d029d8644de829aae5c35a"',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres" DROP CONSTRAINT "FK_3ad46e27e490997c86f4039fd5ea"',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres" DROP CONSTRAINT "FK_7e87e404cce47120f52c505330c"',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" DROP CONSTRAINT "FK_1981015e945776533ec5af88154"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" DROP CONSTRAINT "FK_952b6fda2e51bdbc38c74b20102"',
    );

    await queryRunner.query('DROP INDEX "IDX_934b0d8f9d0084c97d3876ad32"');
    await queryRunner.query('DROP INDEX "IDX_e5263d029d8644de829aae5c35"');

    await queryRunner.query('DROP INDEX "IDX_3ad46e27e490997c86f4039fd5e"');
    await queryRunner.query('DROP INDEX "IDX_7e87e404cce47120f52c505330c"');
    await queryRunner.query('DROP INDEX "IDX_1981015e945776533ec5af88154"');
    await queryRunner.query('DROP INDEX "IDX_952b6fda2e51bdbc38c74b20102"');

    await queryRunner.query('DROP TABLE "users_games_games"');
    await queryRunner.query('DROP TABLE "games"');
    await queryRunner.query('DROP TABLE "genres"');
    await queryRunner.query('DROP TABLE "games_genres"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "orders"');
  }
}
