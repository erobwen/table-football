
CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR (255) UNIQUE NOT NULL,
  won_games_total INTEGER DEFAULT 0, -- breaks normality, but is more simple and efficient.
  won_games_alone INTEGER DEFAULT 0,
  won_games_in_team INTEGER DEFAULT 0
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
  is_ongoing BOOLEAN,
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