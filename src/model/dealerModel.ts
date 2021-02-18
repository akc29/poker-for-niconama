import { CardModel } from "./cardModel";

export class DealerModel {
	cards: CardModel[];
	index: number;

	constructor(cards: CardModel[]) {
		this.cards = cards;
		this.index = 0;
		this.shuffleCards();
	}

	shuffleCards(): void {
		this.index = 0;
		let shuffledCards = [],
			cloneCards = [].concat(this.cards);
		while (cloneCards.length > 0) {
			let index = Math.floor(g.game.random.generate() * cloneCards.length);
			shuffledCards.push(cloneCards[index]);
			cloneCards.splice(index, 1);
		}
		this.cards = shuffledCards;
	}

	getNextCard(): CardModel {
		this.index++;
		return this.cards[this.index-1];
	}
}
