import { ActionModel, TexasHoldemAction } from "./actionModel";
import { CardModel } from "./cardModel";
import { RankModel } from "./rankModel";
import { getRank } from "../util/rankUtil";

export const enum Position {
	SMALL_BLIND = 0,
	BIG_BLIND = 1,
	DEALER = 2,
	DEALER_FOR_HEADS_UP = 3,
	OTHER = 4
}

export interface PlayerModelParameterObject {
	id: string;
	name: string;
	stack: number;
	seatNumber: number;
}

export const DEFAULT_REMAINING_TIME = 15000;
export const WARNIG_TIME = 3000;

export class PlayerModel {
	private id: string;
	private name: string;
	private stack: number;
	private initialStack: number;
	private seatNumber: number;
	private hand: CardModel[];
	private position: Position;
	private action: ActionModel | null;
	private beforeAction: ActionModel | null;
	private temporaryAction: ActionModel | null;
	private remainingMilliSeconds: number;

	constructor(param: PlayerModelParameterObject) {
		this.id = param.id;
		this.name = param.name;
		this.stack = param.stack;
		this.initialStack = param.stack; // TODO: configとかから読むようにした方がいいかも
		this.seatNumber = param.seatNumber;
		this.hand = [];
		this.position = Position.OTHER;
		this.action = null;
		this.beforeAction = null;
		this.temporaryAction = null;
		this.remainingMilliSeconds = DEFAULT_REMAINING_TIME;
	}

	getId(): string {
		return this.id;
	}

	setTemporaryAction(name: TexasHoldemAction, value: number): void {
		this.temporaryAction = { name, value };
	}

	getTemporaryAction(): ActionModel | null {
		return this.temporaryAction;
	}

	clearTemporaryAction(): void {
		this.temporaryAction = null;
	}

	setAction(name: TexasHoldemAction, value: number): void {
		if (this.action) {
			this.beforeAction = { name: this.action.name, value: this.action.value };
		}
		const totalStack = this.getTotalStack();
		const action = { name, value };
		if (value === 0) {
			if (name === "RAISE") {
				action.name = "NONE";
			} else if (name === "CALL") {
				action.name = "CHECK";
			}
		}
		if (value >= totalStack) {
			action.name = "ALLIN";
			action.value = totalStack;
		}
		this.action = action;
	}
	
	getAction(): ActionModel | null {
		return this.action;
	}

	payDiffChip(): void {
		this.stack -= this.getValueToPay();
	}
	
	resetAction(): void {
		this.action = null;
		this.beforeAction = null;
		this.temporaryAction = null;
	}

	getValueToPay(): number {
		// valueの方がbeforeValueより大きくなることを前提としている
		const value =  this.action !== null ? this.action.value : 0;
		const beforeValue =  this.beforeAction !== null ? this.beforeAction.value : 0;
		if (value - beforeValue < 0) {
			throw new Error("current action's value is less than before's");
		}
		return value - beforeValue;
	}
	
	addStack(value: number): void {
		this.stack += value;
	}
	
	getStack(): number {
		return this.stack;
	}

	getTotalStack(): number {
		const actionValue = this.action != null ? this.action.value : 0;
		return this.stack + actionValue;
	}
	
	setStack(money: number): void {
		this.stack = money;
	}
	
	hasHand(): boolean {
		return this.hand.length > 0
	}
	
	hasChip(): boolean {
		return this.stack > 0;
	}
	
	isActive(): boolean {
		return this.hasHand() && this.hasChip();
	}
	
	getCards(): CardModel[] {
		return this.hand;
	}
	
	setCards(cards: CardModel[]): void {
		this.hand = cards;
	}
	
	dumpCards(): void {
		this.hand = [];
	}
	
	getRank(openedCards: CardModel[]): RankModel {
		return getRank(this.hand, openedCards);
	}
	
	getPosition(): Position {
		return this.position;
	}
	
	setPosition(position: Position): void {
		this.position = position;
	}
	
	getSeatNumber(): number {
		return this.seatNumber;
	}
	
	setSeatNumber(index: number): void {
		this.seatNumber = index;
	}
	
	getInitialStack(): number {
		return this.initialStack;
	}
	
	changeInitialiStack(stack: number): void {
		this.initialStack = stack;
	}
	
	getName(): string {
		return this.name;
	}

	setName(name: string): void {
		this.name = name;
	}
	
	resetAll(): void {
		this.stack = this.initialStack;
		this.hand = [];
		this.position = Position.OTHER;
		this.resetAction();
	}

	resetRemainingTime(): void {
		this.remainingMilliSeconds = DEFAULT_REMAINING_TIME;
	}

	updateRemainingTime(time: number): void {
		this.remainingMilliSeconds -= time;
		if (this.remainingMilliSeconds <= 0) {
			this.remainingMilliSeconds = 0;
		}
	}

	getRemainingTime(): number {
		return this.remainingMilliSeconds;
	}

	isTimeUp(): boolean {
		return this.remainingMilliSeconds === 0;
	}
}
