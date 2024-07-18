
CREATE TABLE players (
  id serial PRIMARY KEY,
  name VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE teams (
  id serial PRIMARY KEY,
  "teamKey" VARCHAR UNIQUE NOT NULL,
  name VARCHAR (255) UNIQUE NOT NULL,
  "player1Id" INTEGER REFERENCES players,
  "player2Id" INTEGER REFERENCES players,
  "wonGamesTotal" INTEGER DEFAULT 0, -- breaks normality, but is more simple and efficient.
  "playedGamesTotal" INTEGER DEFAULT 0,
  "goalsAgainst" INTEGER DEFAULT 0,
  "goalsFor" INTEGER DEFAULT 0
);

CREATE TABLE games (
  id serial PRIMARY KEY, 
  finished BOOLEAN,
  "team1Id" INTEGER REFERENCES teams,
  "team2Id" INTEGER REFERENCES teams,
  "team1Score" INTEGER,
  "team2Score" INTEGER
);

-- TODO: Constraint syntax
-- CONSTRAINT fk_blue_team
-- FOREIGN KEY(blue_team) 
--   REFERENCES teams(id)
--     ON DELETE SET NULL