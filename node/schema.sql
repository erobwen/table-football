
CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR (255) UNIQUE NOT NULL,
  won_games_total INTEGER, -- cache or query?
  won_single_games INTEGER,
  won_double_games INTEGER
);

CREATE TABLE teams (
  id serial PRIMARY KEY, 
  name VARCHAR (255) UNIQUE NOT NULL,
  player1 INTEGER REFERENCES users,
  player2 INTEGER REFERENCES users
);

CREATE TABLE games (
  id serial PRIMARY KEY, 
  blue_team INTEGER REFERENCES teams,
  red_team INTEGER REFERENCES teams,
  blue_goals INTEGER,
  red_goals INTEGER,
  blue_to_red_delta INTEGER
);

-- TODO: Constraint syntax
-- CONSTRAINT fk_blue_team
-- FOREIGN KEY(blue_team) 
--   REFERENCES teams(id)
--     ON DELETE SET NULL