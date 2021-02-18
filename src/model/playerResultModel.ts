import { PlayerModel } from "./playerModel";

export interface PlayerResultModel {
	player: PlayerModel;
	place: number;
	stack?: number;
}
