export type CardSuit = "SPADE" | "HEART" | "DIAMOND" | "CLOVER";

export interface CardModelParameterObject {
	suit: CardSuit;
	value: number;
}

export const generateCardModels = (): CardModel[] => {
    let minNum: number = 2,
      maxNum: number = 14,
      suits: CardSuit[] = ["SPADE", "HEART", "DIAMOND", "CLOVER"],
      cards: CardModel[] = [];
    for (let index = minNum; index <= maxNum; index++) {
      suits.forEach((suit) => {
        cards.push(new CardModel({ suit, value: index }));
      });
    }
    return cards;
}

export class CardModel {
	readonly suit: CardSuit;
	readonly value: number;

	constructor(param: CardModelParameterObject) {
		this.suit = param.suit;
		this.value = param.value;
	}

	getCardAssetId(): string {
		let suitName, numberName;
		switch(this.suit) {
			case "SPADE":
				suitName = 's';
				break;
			case "HEART":
				suitName = 'h';
				break;
			case "DIAMOND":
				suitName = 'd';
				break;
			case "CLOVER":
				suitName = 'c';
				break;
		}
		if (this.value === 14) {
			numberName = '01';
		} else if (this.value < 10) {
			numberName = '0' + this.value;
		} else {
			numberName = '' + this.value;
		}
		return suitName + numberName;
	}
}
