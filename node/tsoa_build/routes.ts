/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TeamsController } from './../src/TeamsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlayersController } from './../src/PlayersController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OngoingGameController } from './../src/OngoingGameController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GamesController } from './../src/GamesController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Team": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "teamKey": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "player1Id": {"dataType":"double","required":true},
            "player2Id": {"dataType":"double","required":true},
            "wonGamesTotal": {"dataType":"double","required":true},
            "drawGamesTotal": {"dataType":"double","required":true},
            "playedGamesTotal": {"dataType":"double","required":true},
            "goalsAgainst": {"dataType":"double","required":true},
            "goalsFor": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamExtended": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "teamKey": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "player1Id": {"dataType":"double","required":true},
            "player2Id": {"dataType":"double","required":true},
            "wonGamesTotal": {"dataType":"double","required":true},
            "drawGamesTotal": {"dataType":"double","required":true},
            "playedGamesTotal": {"dataType":"double","required":true},
            "goalsAgainst": {"dataType":"double","required":true},
            "goalsFor": {"dataType":"double","required":true},
            "winRatio": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}],"required":true},
            "lostGamesTotal": {"dataType":"double","required":true},
            "goalsDifference": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchResult": {
        "dataType": "refEnum",
        "enums": ["win","draw","loss"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchPlayed": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "result": {"ref":"MatchResult","required":true},
            "opponentId": {"dataType":"double","required":true},
            "opponentName": {"dataType":"string","required":true},
            "yourScore": {"dataType":"double","required":true},
            "theirScore": {"dataType":"double","required":true},
            "difference": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Player": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Game": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "finished": {"dataType":"boolean","required":true},
            "team1Id": {"dataType":"double","required":true},
            "team2Id": {"dataType":"double","required":true},
            "team1Score": {"dataType":"double","required":true},
            "team2Score": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.get('/teams',
            ...(fetchMiddlewares<RequestHandler>(TeamsController)),
            ...(fetchMiddlewares<RequestHandler>(TeamsController.prototype.getTeams)),

            async function TeamsController_getTeams(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TeamsController();

              await templateService.apiHandler({
                methodName: 'getTeams',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/teams/sorted',
            ...(fetchMiddlewares<RequestHandler>(TeamsController)),
            ...(fetchMiddlewares<RequestHandler>(TeamsController.prototype.getTeamsSorted)),

            async function TeamsController_getTeamsSorted(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TeamsController();

              await templateService.apiHandler({
                methodName: 'getTeamsSorted',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/teams/:id',
            ...(fetchMiddlewares<RequestHandler>(TeamsController)),
            ...(fetchMiddlewares<RequestHandler>(TeamsController.prototype.getTeam)),

            async function TeamsController_getTeam(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TeamsController();

              await templateService.apiHandler({
                methodName: 'getTeam',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/teams/:id/history',
            ...(fetchMiddlewares<RequestHandler>(TeamsController)),
            ...(fetchMiddlewares<RequestHandler>(TeamsController.prototype.getTeamHistory)),

            async function TeamsController_getTeamHistory(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TeamsController();

              await templateService.apiHandler({
                methodName: 'getTeamHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/teams',
            ...(fetchMiddlewares<RequestHandler>(TeamsController)),
            ...(fetchMiddlewares<RequestHandler>(TeamsController.prototype.postTeam)),

            async function TeamsController_postTeam(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"player2Id":{"dataType":"any","required":true},"player1Id":{"dataType":"any","required":true},"name":{"dataType":"any","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TeamsController();

              await templateService.apiHandler({
                methodName: 'postTeam',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/players',
            ...(fetchMiddlewares<RequestHandler>(PlayersController)),
            ...(fetchMiddlewares<RequestHandler>(PlayersController.prototype.getPlayers)),

            async function PlayersController_getPlayers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PlayersController();

              await templateService.apiHandler({
                methodName: 'getPlayers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/players',
            ...(fetchMiddlewares<RequestHandler>(PlayersController)),
            ...(fetchMiddlewares<RequestHandler>(PlayersController.prototype.postPlayer)),

            async function PlayersController_postPlayer(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PlayersController();

              await templateService.apiHandler({
                methodName: 'postPlayer',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ongoing-game',
            ...(fetchMiddlewares<RequestHandler>(OngoingGameController)),
            ...(fetchMiddlewares<RequestHandler>(OngoingGameController.prototype.get)),

            async function OngoingGameController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OngoingGameController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/ongoing-game',
            ...(fetchMiddlewares<RequestHandler>(OngoingGameController)),
            ...(fetchMiddlewares<RequestHandler>(OngoingGameController.prototype.put)),

            async function OngoingGameController_put(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    game: {"in":"body","name":"game","required":true,"ref":"Game"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OngoingGameController();

              await templateService.apiHandler({
                methodName: 'put',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/games',
            ...(fetchMiddlewares<RequestHandler>(GamesController)),
            ...(fetchMiddlewares<RequestHandler>(GamesController.prototype.postGame)),

            async function GamesController_postGame(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"body","name":"request","required":true,"ref":"Game"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new GamesController();

              await templateService.apiHandler({
                methodName: 'postGame',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
