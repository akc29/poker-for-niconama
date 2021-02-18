import { Label } from "@akashic-extension/akashic-label";
import { BaseScene, basicFont } from "./baseScene";
import { RecruitmentScene } from "./recruitmentScene";
import { RuleScene } from "./ruleScene";

export interface TitleScenePrameterObject extends g.SceneParameterObject {
	isCpuMode: boolean;
}

export class TitleScene extends BaseScene {
	private isCpuMode: boolean;
	constructor(param: TitleScenePrameterObject) {
		super(param);
	}

	protected initialize(param: TitleScenePrameterObject) {
		this.isCpuMode = param.isCpuMode;
	}

	protected handlerToLoad(): void {
		// TODO: タイトル絵とか背景絵的なやつ
		const backRect = new g.FilledRect({
			scene: this,
			cssColor: "white",
			width: g.game.width,
			height: g.game.height
		});
		this.append(backRect);
		const titleLabel = new Label({
			scene: this,
			text: "テキサスホールデムポーカー",
			font: basicFont,
			fontSize: 48,
			textColor: "black",
			textAlign: "center",
			width: g.game.width,
			y: 0.1 * g.game.width,
			local: true
		});
		this.append(titleLabel);
		this.onStateChange.add(state => {
			if (state === "active") {
				this.moveRecruitmentScene();
			}
		});
		this.moveRecruitmentScene();
	}

	private moveRecruitmentScene(time = 3000) {
		// なんか時間経過もしくはクリックで次のシーンに移るイベントを書いておく
		this.setTimeout(() => {
			if (this.isCpuMode) {
				g.game.pushScene(new RuleScene({ game: g.game, assetIds: ["structuresConfig"] }));
			} else {
				g.game.pushScene(new RecruitmentScene({ game: g.game, assetIds: ["structuresConfig"] }));
			}
		}, time);
	}
}
