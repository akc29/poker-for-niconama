export type CommonStatus = "NONE" | "DRAWING";
export type GameStatus = 
	CommonStatus
	| "GAME_START"
	| "GAME_CONTINUE"
	| "START_PHASE"
	| "NEXT_PLAYER"
	| "PLAYER_DESIDE"
	| "FOLD_END"
	| "SHOWDOWN"
	| "WIN_OR_LOSS_DECISION"
	| "JUDGE_CONTINUE_GAME"
	| "WAITING"
	| "NEXT_PHASE"
	| "PLAYER_THINKING"
	| "AI_PLAYER_THINKING"
	| "PLAYER_THINKING_TIME"
	| "GAME_END"
	| "WAIT_NEXT_GAME";
export type RecruitmentStatus = CommonStatus | "C" | "D";
export type AllStatus = GameStatus | RecruitmentStatus;
