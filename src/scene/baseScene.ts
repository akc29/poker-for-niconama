import { AllStatus } from "../type/status";

export const basicFont = new g.DynamicFont({
	game: g.game,
	fontFamily: "serif",
	size: 48
});

export abstract class BaseScene extends g.Scene {
	protected statusQueue: AllStatus[] = [];

	constructor(param: g.SceneParameterObject) {
		super(param);
		this.initialize(param);
		this.onLoad.add(this.handlerToLoad, this);
	}

	protected abstract initialize(param: any): void;

	getCurrentStatus(): AllStatus {
		return this.statusQueue.length === 0 ? "NONE" : this.statusQueue[this.statusQueue.length - 1];
	}
	
	popStatus(): AllStatus {
		return this.statusQueue.length === 0 ? "NONE" : this.statusQueue.pop();
	}
	
	pushStatus(status: AllStatus): void {
		if (status === "NONE") {
			return;
		}
		this.statusQueue.push(status);
	}

	changeStatus(status: AllStatus): void {
		this.popStatus();
		this.pushStatus(status);
	}
	
	pushStatuses(statuses: AllStatus[]): void {
		statuses.forEach(status => {
			this.pushStatus(status);
		});
	}

	/**
	 * この中でエンティティやハンドラの登録等行う
	*/
	protected abstract handlerToLoad(): void;
}