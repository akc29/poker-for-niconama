import { RankModel } from "./rankModel";

export interface OneGameResultModel {
	id: string;
	rank: RankModel | null;
	value: number;
}
