export interface StructureData {
	smallBlind: number;
	bigBlind: number;
	time: number;
	ante?: number;
}

export interface StructureModelParameterObject {
	structures: StructureData[];
	currentIndex?: number;
}

export class StructureModel {
	private structures: StructureData[];
	private currentIndex: number;
	private currentMilliSeconds: number;

	constructor(param: StructureModelParameterObject) {
		this.structures = param.structures;
		this.currentIndex = param.currentIndex || 0;
		this.currentMilliSeconds = 1000 * this.structures[this.getCurrentIndex()].time;
	}

	getCurrentStructure(): StructureData {
		if (this.structures.length === 0) {
			throw new Error("ストラクチャーのデータがありません");
		}
		return this.structures[this.getCurrentIndex()];
	}

	getNextStructure(): StructureData | null {
		if (this.currentIndex + 1 >= this.structures.length) {
			return null;
		}
		return this.structures[this.currentIndex + 1];
	}

	isFinished(): boolean {
		return this.currentMilliSeconds === 0 && this.currentIndex === this.structures.length;
	}

	nextBlind(): void {
		if (this.currentIndex === this.structures.length) {
			return;
		}
		if (this.currentMilliSeconds === 0) {
			this.currentIndex++;
			this.currentMilliSeconds = this.currentIndex < this.structures.length ? 1000 * this.structures[this.currentIndex].time : 0;
		}
	}

	updateCurrentMilliSeconds(milliSeconds: number): void {
		this.currentMilliSeconds -= milliSeconds;
		if (this.currentMilliSeconds < 0) {
			this.currentMilliSeconds = 0;
		}
	}

	getCurrentSeconds(): number {
		return Math.ceil(this.currentMilliSeconds / 1000);
	}

	private getCurrentIndex(): number {
		return this.currentIndex < this.structures.length ? this.currentIndex : this.structures.length - 1;
	}
}
