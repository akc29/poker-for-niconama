export type GameMode = "ring" | "tornament";
export type GameTerm = "long" | "middle" | "short";

export const getGameModeName = (mode: GameMode): string => {
	switch(mode) {
		case "ring":
			return "リングゲーム";
		case "tornament":
			return "トーナメント";
		default:
			return "";
	}
};
