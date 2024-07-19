"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.getAllPlayers = getAllPlayers;
exports.getPlayer = getPlayer;
exports.addPlayer = addPlayer;
exports.getAllTeams = getAllTeams;
exports.getTeam = getTeam;
exports.getTeamGameHistory = getTeamGameHistory;
exports.getSharedGameHistory = getSharedGameHistory;
exports.uniqueTeamKey = uniqueTeamKey;
exports.addTeam = addTeam;
exports.getPlayerIds = getPlayerIds;
exports.addGame = addGame;
exports.getOngoingGame = getOngoingGame;
exports.updateOngoingGame = updateOngoingGame;
exports.finishOngoingGame = finishOngoingGame;
exports.updateStatistics = updateStatistics;
exports.incrementPlayedStatistics = incrementPlayedStatistics;
var pg_1 = require("pg");
var Client = pg_1.default.Client;
var fs = require("fs");
var schema = fs.readFileSync('schema.sql').toString();
exports.client = new Client({
    user: 'postgres',
    // host: 'localhost', // when running outside docker for dev. 
    host: 'db',
    database: 'postgres',
    password: '1234',
    port: 5432,
});
exports.client.connect();
var createTables = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.client.query("\n    CREATE TABLE IF NOT EXISTS migrations (\n      id serial PRIMARY KEY\n    );\n  ")];
            case 1:
                _a.sent();
                return [4 /*yield*/, exports.client.query("SELECT * FROM migrations")];
            case 2:
                response = _a.sent();
                if (!!response.rows.length) return [3 /*break*/, 8];
                // DB Schema
                return [4 /*yield*/, exports.client.query(schema)];
            case 3:
                // DB Schema
                _a.sent();
                // Some dummy data for convenient development.  
                return [4 /*yield*/, addPlayer("Player A")];
            case 4:
                // Some dummy data for convenient development.  
                _a.sent();
                return [4 /*yield*/, addPlayer("Player B")];
            case 5:
                _a.sent();
                return [4 /*yield*/, addPlayer("Player C")];
            case 6:
                _a.sent();
                // Mark done
                return [4 /*yield*/, exports.client.query("\n      INSERT INTO migrations (id) \n        VALUES \n          (1);\n    ")];
            case 7:
                // Mark done
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
createTables();
/**
 * Players
 */
function getAllPlayers() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.query("SELECT * FROM players;")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, (result).rows];
            }
        });
    });
}
function getPlayer(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.query("SELECT * FROM players WHERE players.id=".concat(id, ";"))];
                case 1: return [2 /*return*/, (_a.sent()).rows[0]];
            }
        });
    });
}
function addPlayer(name) {
    return __awaiter(this, void 0, void 0, function () {
        var response, id, teamKey, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 7]);
                    return [4 /*yield*/, exports.client.query('BEGIN')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, exports.client.query("INSERT INTO players(name) VALUES('".concat(name, "') RETURNING id;"))];
                case 2:
                    response = _a.sent();
                    id = response.rows[0].id;
                    teamKey = uniqueTeamKey(id, null);
                    return [4 /*yield*/, exports.client.query("INSERT INTO teams(\"teamKey\", name, \"player1Id\", \"player2Id\") VALUES('".concat(teamKey, "', '").concat(name, "', ").concat(id, ", NULL);"))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, exports.client.query('COMMIT')];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    return [4 /*yield*/, exports.client.query('ROLLBACK')];
                case 6:
                    _a.sent();
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Teams
 */
function getAllTeams() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.query("SELECT * FROM teams")];
                case 1: return [2 /*return*/, (_a.sent()).rows];
            }
        });
    });
}
function getTeam(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.query("SELECT * FROM teams WHERE teams.id=".concat(id, ";"))];
                case 1: return [2 /*return*/, (_a.sent()).rows[0]];
            }
        });
    });
}
function getTeamGameHistory(id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = changePerspective;
                    _b = [id];
                    return [4 /*yield*/, exports.client.query("\n      SELECT games.id, \"team1Id\", \"team2Id\", \"team1Score\", \"team2Score\", team1.name as \"team1Name\", team2.name as \"team2Name\" FROM games \n      JOIN teams as team1 ON games.\"team1Id\"=team1.id\n      JOIN teams as team2 ON games.\"team2Id\"=team2.id\n      WHERE (games.\"team1Id\"=".concat(id, " OR games.\"team2Id\"=").concat(id, ") AND finished=true;\n    "))];
                case 1: return [2 /*return*/, (_a.apply(void 0, _b.concat([(_c.sent()).rows])))];
            }
        });
    });
}
// Note: not in use currently, taken care of on front end to avoid extra load. 
function getSharedGameHistory(id, otherId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = changePerspective;
                    _b = [id];
                    return [4 /*yield*/, exports.client.query("\n    SELECT games.id, \"team1Id\", \"team2Id\", \"team1Score\", \"team2Score\", team1.name as \"team1Name\", team2.name as \"team2Name\" FROM games \n    JOIN teams as team1 ON games.\"team1Id\"=team1.id\n    JOIN teams as team2 ON games.\"team2Id\"=team2.id\n    WHERE (games.\"team1Id\"=".concat(id, " AND games.\"team2Id\"=").concat(otherId, ") OR (games.\"team1Id\"=").concat(otherId, " AND games.\"team2Id\"=").concat(id, ") AND finished=true;\n  "))];
                case 1: return [2 /*return*/, (_a.apply(void 0, _b.concat([(_c.sent()).rows])))];
            }
        });
    });
}
var changePerspective = function (id, gameHistory) {
    return gameHistory.map(function (game) {
        if (game.team1Id === id) {
            return ({
                id: game.id,
                win: game.team1Score > game.team2Score,
                draw: game.team1Score === game.team2Score,
                opponentId: game.team2Id,
                opponentName: game.team2Name,
                yourScore: game.team1Score,
                theirScore: game.team2Score,
                difference: game.team1Score - game.team2Score
            });
        }
        else {
            return ({
                id: game.id,
                win: game.team2Score > game.team1Score,
                draw: game.team1Score === game.team2Score,
                opponentId: game.team1Id,
                opponentName: game.team1Name,
                yourScore: game.team2Score,
                theirScore: game.team1Score,
                difference: game.team2Score - game.team1Score
            });
        }
    });
};
function uniqueTeamKey(id1, id2) {
    // Note: Null/undefined is set to 0, this works since serial starts from 1'
    if (!id1)
        id1 = 0;
    if (!id2)
        id2 = 0;
    return id1 > id2 ? "".concat(id1, ".").concat(id2) : "".concat(id2, ".").concat(id1);
}
function addTeam(name, player1Id, player2Id) {
    return __awaiter(this, void 0, void 0, function () {
        var teamKey, player1, player2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    teamKey = uniqueTeamKey(player1Id, player2Id);
                    if (!!name) return [3 /*break*/, 3];
                    return [4 /*yield*/, getPlayer(player1Id)];
                case 1:
                    player1 = _a.sent();
                    return [4 /*yield*/, getPlayer(player2Id)];
                case 2:
                    player2 = _a.sent();
                    name = "".concat(player1.name, " & ").concat(player2.name);
                    _a.label = 3;
                case 3: return [4 /*yield*/, exports.client.query("INSERT INTO teams(\"teamKey\", name, \"player1Id\", \"player2Id\") VALUES ('".concat(teamKey, "', '").concat(name, "', ").concat(player1Id, ", ").concat(player2Id, ");"))];
                case 4:
                    _a.sent();
                    return [2 /*return*/, teamKey];
            }
        });
    });
}
function getPlayerIds(teamId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, team;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    return [4 /*yield*/, getTeam(teamId)];
                case 1:
                    team = _a.sent();
                    if (team.player1Id)
                        result.push(team.player1Id);
                    if (team.player2Id)
                        result.push(team.player2Id);
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * Games
 */
function addGame(finished, team1Id, team2Id, team1Score, team2Score) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 8]);
                    return [4 /*yield*/, exports.client.query('BEGIN')
                        // Update statistics
                    ];
                case 1:
                    _a.sent();
                    if (!finished) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateStatistics(team1Id, team2Id, team1Score, team2Score)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, exports.client.query("INSERT INTO games(finished, \"team1Id\", \"team2Id\", \"team1Score\", \"team2Score\") VALUES(".concat(finished, ", ").concat(team1Id, ", ").concat(team2Id, ", ").concat(team1Score, ", ").concat(team2Score, ") RETURNING *;"))];
                case 4:
                    response = _a.sent();
                    return [4 /*yield*/, exports.client.query('COMMIT')];
                case 5:
                    _a.sent();
                    return [2 /*return*/, response.rows[0]];
                case 6:
                    error_2 = _a.sent();
                    return [4 /*yield*/, exports.client.query('ROLLBACK')];
                case 7:
                    _a.sent();
                    throw error_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Ongoing game
 */
function getOngoingGame() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.query("SELECT * FROM games WHERE games.finished=false;")];
                case 1: return [2 /*return*/, (_a.sent()).rows[0]];
            }
        });
    });
}
function updateOngoingGame(game) {
    return __awaiter(this, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOngoingGame()];
                case 1:
                    existing = _a.sent();
                    if (existing.finished)
                        throw new Error("Cannot update finished game!");
                    if (existing.id !== game.id)
                        throw new Error("Wrong id at game update?");
                    return [4 /*yield*/, exports.client.query("UPDATE games SET \"team1Score\" = ".concat(game.team1Score, ", \"team2Score\" = ").concat(game.team2Score, " WHERE id = ").concat(game.id, ";"))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function finishOngoingGame(game) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOngoingGame()];
                case 1:
                    existing = _a.sent();
                    if (existing.id !== game.id)
                        throw new Error("Wrong id at game update?");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 8]);
                    return [4 /*yield*/, exports.client.query('BEGIN')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, exports.client.query("UPDATE games SET finished = true WHERE id = ".concat(game.id, ";"))];
                case 4:
                    _a.sent();
                    updateStatistics(game.team1Id, game.team2Id, game.team1Score, game.team2Score);
                    return [4 /*yield*/, exports.client.query('COMMIT')];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    error_3 = _a.sent();
                    return [4 /*yield*/, exports.client.query('ROLLBACK')];
                case 7:
                    _a.sent();
                    throw error_3;
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Statistics
 */
function updateStatistics(team1Id, team2Id, team1Score, team2Score) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(team1Score > team2Score)) return [3 /*break*/, 3];
                    return [4 /*yield*/, incrementPlayedStatistics(true, false, team1Id, team1Score, team2Score)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, incrementPlayedStatistics(false, false, team2Id, team2Score, team1Score)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 3:
                    if (!(team1Score < team2Score)) return [3 /*break*/, 6];
                    return [4 /*yield*/, incrementPlayedStatistics(true, false, team2Id, team2Score, team1Score)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, incrementPlayedStatistics(false, false, team1Id, team1Score, team2Score)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, incrementPlayedStatistics(false, true, team2Id, team2Score, team1Score)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, incrementPlayedStatistics(false, true, team1Id, team1Score, team2Score)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function incrementPlayedStatistics(winner, draw, teamId, goalsFor, goalsAgainst) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.query("\n    UPDATE teams SET \n      \"wonGamesTotal\" = \"wonGamesTotal\" + ".concat(winner ? 1 : 0, ", \n      \"drawGamesTotal\" = \"drawGamesTotal\" + ").concat(draw ? 1 : 0, ", \n      \"playedGamesTotal\" = \"playedGamesTotal\" + 1, \n      \"goalsFor\" = \"goalsFor\" + ").concat(goalsFor, ",   \n      \"goalsAgainst\" = \"goalsAgainst\" + ").concat(goalsAgainst, "  \n      WHERE id = ").concat(teamId, ";"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
