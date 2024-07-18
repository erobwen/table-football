
CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR (255) UNIQUE NOT NULL,
  won_games_total INTEGER DEFAULT 0, -- breaks normality, but is more simple and efficient.
  played_games_total INTEGER DEFAULT 0,
  won_games_single INTEGER DEFAULT 0,
  played_games_single INTEGER DEFAULT 0 
);

CREATE TABLE teams (
  id serial PRIMARY KEY,
  team_key VARCHAR UNIQUE NOT NULL,
  name VARCHAR (255) UNIQUE NOT NULL,
  player1_id INTEGER REFERENCES users,
  player2_id INTEGER REFERENCES users
);

CREATE TABLE games (
  id serial PRIMARY KEY, 
  finished BOOLEAN,
  "team1Id" INTEGER REFERENCES teams,
  "team2Id" INTEGER REFERENCES teams,
  "team1Score" INTEGER,
  "team2Score" INTEGER,
);

-- TODO: Constraint syntax
-- CONSTRAINT fk_blue_team
-- FOREIGN KEY(blue_team) 
--   REFERENCES teams(id)
--     ON DELETE SET NULL