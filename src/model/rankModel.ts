export const enum RankStrength {
	ROYAL_STRAIGHT_FLUSH = 10,
	STRAIGHT_FLUSH = 9,
	STRONG_RANK = 8.1,
	FOUR_CARD = 8,
	FULL_HOUSE = 7,
	FLUSH = 6,
	STRAIGHT = 5,
	HIGH_THREE_CARD = 4.3,
	MIDDLE_THREE_CARD = 4.2,
	LOW_THREE_CARD = 4.1,
	THREE_CARD = 4,
	HIGH_TWO_PAIR = 3.3,
	MIDDLE_TWO_PAIR = 3.2,
	TWO_PAIR_TOP = 3.15,
	LOW_TWO_PAIR = 3.1,
	TWO_PAIR = 3,
	ONE_PAIR_A = 2.7,
	ONE_PAIR_K = 2.6,
	ONE_PAIR_Q = 2.5,
	ONE_PAIR_TOP = 2.45,
	ONE_PAIR_MIDDLE = 2.2,
	ONE_PAIR_LOW = 2.1,
	ONE_PAIR = 2,
	NO_PAIR_A = 1.7,
	NO_PAIR_K = 1.6,
	NO_PAIR_Q = 1.5,
	NO_PAIR_HIGH = 1.45,
	NO_PAIR_MIDDLE = 1.2,
	NO_PAIR_LOW = 1.1,
	NO_PAIR = 1
}

export class RankModel {
	readonly strength: RankStrength;
	readonly top: number;
	readonly bottom: number;
	readonly kickers: number[];

	constructor(strength: RankStrength, top: number, bottom: number = 0, kickers: number[] = [0, 0, 0, 0, 0]) {
		this.strength = strength;
		this.top = top;
		this.bottom = bottom;
		this.kickers = kickers;
	}

	getRankName(): string {
		const rank = Math.floor(this.strength);
		switch(rank) {
			case RankStrength.ROYAL_STRAIGHT_FLUSH:
				return 'ロイヤルストレートフラッシュ';
			case RankStrength.STRAIGHT_FLUSH:
				return 'ストレートフラッシュ';
			case RankStrength.FOUR_CARD:
				return 'フォーカード';
			case RankStrength.FULL_HOUSE:
				return 'フルハウス';
			case RankStrength.FLUSH:
				return 'フラッシュ';
			case RankStrength.STRAIGHT:
				return 'ストレート';
			case RankStrength.THREE_CARD:
				return 'スリーカード';
			case RankStrength.TWO_PAIR:
				return 'ツーペア';
			case RankStrength.ONE_PAIR:
				return 'ワンペア';
			default:
				return 'ハイカード';
		}
	}
}
