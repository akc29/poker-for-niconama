import { CardModel } from "./cardModel";

export interface ChipPot {
	id: string;
	chip: number;
}

export class BoardModel {
	private openedCards: CardModel[] = [];
	private chipPots: ChipPot[] = [];

	getOpenedCards(): CardModel[] {
		return this.openedCards;
	}

	setCard(card: CardModel): void {
		this.openedCards.push(card);
	}

	addChip(pot: ChipPot): void {
		let index;
		for (index = 0; index < this.chipPots.length; index++) {
		if (pot.id === this.chipPots[index].id) {
			break;
		}
		}
		if (index === this.chipPots.length) {
		this.chipPots.push(pot);
		} else {
		this.chipPots[index].chip += pot.chip;
		}
	}

	takePotForSurvivor(id: string): ChipPot[] {
		let targetPot = this.getPotById(id),
			totalValue = 0;
		this.chipPots.forEach((pot) => {
			if (id !== pot.id) {
				totalValue += pot.chip;
				pot.chip = 0;
			}
		});
		targetPot.chip += totalValue;
		return this.chipPots;
	}

	// idsはpotの少ない順に並んでいる想定
	takePotForMulti(ids: string[], targetValue?: number): ChipPot[] {
		if (ids.length === 0) {
			return [];
		}
		const targetPot = this.getPotById(ids[0]);
		if (targetValue === undefined) {
			targetValue = targetPot.chip;
		}
		const nextValue = ids.length >= 2 ? this.getPotById(ids[1]).chip - targetValue : 0; // 次の配当分はポット計算中に消えてしまうので先に算出しておく
		if (targetValue > 0) {
			let totalValue = 0;
			this.chipPots.forEach((pot) => {
				const value = targetValue > pot.chip ? pot.chip : targetValue;
				totalValue += value;
				pot.chip -= value;
			});
			this.chipPots.forEach((pot) => {
				if (ids.indexOf(pot.id) !== -1) {
					pot.chip += Math.round(totalValue / ids.length);
				}
			});
		}
		this.chipPots = this.chipPots.filter(pot => pot.id !== ids[0]);
		return [targetPot].concat(this.takePotForMulti(ids.slice(1), nextValue));
	}

	getPotById(id: string): ChipPot {
		let pots = this.chipPots.filter(pot => id === pot.id);
		return pots[0];
	}

	getChipPots(): ChipPot[] {
		return this.chipPots;
	}

	getPotValue(): number {
		let totalValue = 0;
		this.chipPots.forEach((pot) => {
			totalValue += pot.chip;
		});
		return totalValue;
	}

	clear(): void {
		this.openedCards = [];
		this.chipPots = [];
	}
}
