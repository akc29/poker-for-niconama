export type TexasHoldemAction = "ALLIN" | "RAISE" | "CALL" | "CHECK" | "FOLD" | "NONE";
export type RaiseActionPattern = "THREE_BB" | "HALF_POT" | "POT" | "ALLIN" | "NONE";

export interface ActionModel {
	name: TexasHoldemAction;
	value: number;
}
