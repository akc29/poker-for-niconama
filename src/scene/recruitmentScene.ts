import * as tool from "@akc29/akashictool4multi";
import { Label } from "@akashic-extension/akashic-label";
import { PlayerModelParameterObject } from "../model/playerModel";
import { AssetIds } from "../type/assetIds";
import { BaseScene, basicFont } from "./baseScene";
import { GameScene } from "./gameScene";
import { GameMode, GameTerm } from "../type/gameMode";
import { StructureData } from "../model/structureModel";

export interface RecruitmentScenePrameterObject extends g.SceneParameterObject {}

export interface SelectorItem {
	name: string,
	value: any;
}

const MAX_PLAYER_COUNT = 8; // 試しにMAX8名としておく
const MIN_PLAYER_COUNT = 2;
const GAME_MODE_KEY: string = "mode";
const GAME_TERM_KEY: string = "term";
const gameModeSelectorItems: SelectorItem[] = [
	{ name: "リングゲーム", value: "ring"},
	{ name: "トーナメント", value: "tornament"}
];
const gameTermSelectorItems: SelectorItem[] = [
	{ name: "短め", value: "short"},
	{ name: "普通", value: "middle"},
	{ name: "長め", value: "long"}
];
export class RecruitmentScene extends BaseScene {
	private entry: tool.AkashicEntry;
	private gameMode: GameMode;
	private gameTerm: GameTerm;

	constructor(param: RecruitmentScenePrameterObject) {
		super(param);
	}

	protected initialize(_param: RecruitmentScenePrameterObject) {
		this.entry = new tool.AkashicEntry({
			scene: this,
			playableLimit: MAX_PLAYER_COUNT,
			startableCount: MIN_PLAYER_COUNT,
			premiumuRate: 3,
			callbackAfterDicision: (members: tool.PlayerInfo[]) => {
				// とりあえずリングゲームを固定で作る感じで
				// TODO: 配信者側からリングかトナメか選べるようにする。その場合、ゲーム側でもトナメ(やリング)専用の処理を書く必要がある。
				g.game.pushScene(this.createGameScene(members));
			}
		});
	}

	protected handlerToLoad(): void {
		const backRect = new g.FilledRect({
			scene: this,
			cssColor: "white",
			width: g.game.width,
			height: g.game.height
		});
		this.append(backRect);
		const contributerEntity = this.createContributerPane();
		const audienceEntity = this.createAudiencePane();
		let isJoined: boolean = false;
		this.append(audienceEntity);
		this.onUpdate.add(() => {
			if (g.game.joinedPlayerIds.indexOf(g.game.selfId) !== -1) {
				if (!isJoined) {
					isJoined = true;
					this.remove(audienceEntity);
					this.append(contributerEntity);
					this.entry.enter({
						id: g.game.selfId,
						name: "配信者" + Math.floor(1000 * g.game.localRandom.generate())
					}, true);
				}
			} else {
				if (isJoined) {
					isJoined = false;
					this.remove(contributerEntity);
					this.append(audienceEntity);
					this.entry.cancel(g.game.selfId);
				}
			}
		});
	}

	private createGameScene(members: tool.PlayerInfo[]): GameScene {
		const assetIds = (JSON.parse((g.game.assets["assetIdsConfig"] as g.TextAsset).data) as AssetIds).game;
		const players: PlayerModelParameterObject[] = [];
		for (let i = 0; i < members.length; i++) {
			const info = members[i];
			players.push({
				id: info.id,
				name: info.name,
				stack: 10000, // 一旦固定
				seatNumber: i
			});
		}
		const mode: GameMode = this.entry.getOptionValue(GAME_MODE_KEY) || "ring";
		const term: GameTerm = this.entry.getOptionValue(GAME_TERM_KEY) || "short";
		const key: string = `${mode}-${term}`;
		const structuresMap = (JSON.parse(this.asset.getTextById("structuresConfig").data) as {[key: string]: StructureData[]});
		return new GameScene({
			game: g.game,
			assetIds,
			service: {
				mode,
				players,
				structure: {
					structures: structuresMap[key],
					currentIndex: 0
				}
			}
		});
	}

	private createContributerPane(): g.E {
		const entity = new g.E({scene: this, width: g.game.width, height: g.game.height});
		entity.append(this.createPlayerInfoEntity({
			x: 0.05 * g.game.width,
			y: 0.1 * g.game.height,
			width: 0.9 * g.game.width,
			height: 0.45 * g.game.height
		}));
		entity.append(this.createSelectorEntity(
			{
				x: 0.05 * g.game.width,
				y: 0.525 * g.game.height,
				width: 0.9 * g.game.width,
				height: 0.1 * g.game.height
			},
			"ゲーム種別:",
			GAME_MODE_KEY,
			gameModeSelectorItems
		));
		entity.append(this.createSelectorEntity(
			{
				x: 0.05 * g.game.width,
				y: 0.65 * g.game.height,
				width: 0.9 * g.game.width,
				height: 0.1 * g.game.height
			},
			"ゲーム時間:",
			GAME_TERM_KEY,
			gameTermSelectorItems
		));
		const startButton = new g.FilledRect({
			scene: this,
			cssColor: "gray",
			x: 0.4 * g.game.width,
			y: 0.8 * g.game.height,
			width: 0.2 * g.game.width,
			height: 0.1 * g.game.height,
			opacity: 0.5,
			local: true,
			touchable: true
		});
		const startLabel = new Label({
			scene: this,
			text: "ゲーム開始",
			font: basicFont,
			fontSize: 24,
			textColor: "black",
			textAlign: "center",
			width: 0.2 * g.game.width,
			y: 0.05 * startButton.height,
			local: true
		});
		startButton.onPointUp.add(() => {
			// TODO: 参加希望2人未満ならボタンをdisableにする
			if (this.entry.getEnteredMenmberCount() >= 2) {
				this.entry.decidePlayableMembers();
			}
		});
		startButton.append(startLabel);
		entity.append(startButton);

		return entity;
	}

	private createAudiencePane(): g.E {
		const entity = new g.E({scene: this, width: g.game.width, height: g.game.height});
		entity.append(this.createPlayerInfoEntity({
			x: 0.05 * g.game.width,
			y: 0.1 * g.game.height,
			width: 0.9 * g.game.width,
			height: 0.45 * g.game.height
		}));
		const gameModeLabel = new Label({
			scene: this,
			text: "ゲーム種別: ",
			font: basicFont,
			fontSize: 32,
			textColor: "black",
			textAlign: "left",
			width: 0.9 * g.game.width,
			x: 0.2 * g.game.width,
			y: 0.525 * g.game.height,
		});
		gameModeLabel.onUpdate.add(() => {
			const gameMode = this.entry.getOptionValue(GAME_MODE_KEY);
			if (gameMode && gameMode !== this.gameMode) {
				this.gameMode = gameMode;
				const targets = gameModeSelectorItems.filter(item => item.value === gameMode);
				if (targets.length > 0) {
					gameModeLabel.text = "ゲーム種別: " + targets[0].name;
					gameModeLabel.invalidate();
				}
			}
		});
		entity.append(gameModeLabel);
		const gameTermLabel = new Label({
			scene: this,
			text: "ゲーム時間: ",
			font: basicFont,
			fontSize: 32,
			textColor: "black",
			textAlign: "left",
			width: 0.9 * g.game.width,
			x: 0.2 * g.game.width,
			y: 0.65 * g.game.height,
		});
		gameTermLabel.onUpdate.add(() => {
			const gameTerm = this.entry.getOptionValue(GAME_TERM_KEY);
			if (gameTerm && gameTerm !== this.gameTerm) {
				this.gameTerm = gameTerm;
				const targets = gameTermSelectorItems.filter(item => item.value === gameTerm);
				if (targets.length > 0) {
					gameTermLabel.text = "ゲーム時間: " + targets[0].name;
					gameTermLabel.invalidate();
				}
			}
		});
		entity.append(gameTermLabel);
		const entryButton = new g.FilledRect({
			scene: this,
			cssColor: "gray",
			x: 0.25 * g.game.width,
			y: 0.8 * g.game.height,
			width: 0.2 * g.game.width,
			height: 0.1 * g.game.height,
			opacity: 0.5,
			local: true,
			touchable: true
		});
		const entryLabel = new Label({
			scene: this,
			text: "ゲームに参加",
			font: basicFont,
			fontSize: 20,
			textColor: "white",
			textAlign: "center",
			width: entryButton.width,
			y: 0.05 * entryButton.height,
			local: true
		});
		entryButton.onPointUp.add(() => {
			entryButton.cssColor = "yellow";
			entryButton.modified();
			entryLabel.textColor = "red";
			entryLabel.invalidate();
			this.entry.enter({
				id: g.game.selfId,
				name: "匿名" + Math.floor(1000 * g.game.localRandom.generate())
			}, true);
		});
		entryButton.append(entryLabel);
		entity.append(entryButton);
		const cancelButton = new g.FilledRect({
			scene: this,
			cssColor: "gray",
			x: 0.55 * g.game.width,
			y: 0.8 * g.game.height,
			width: 0.2 * g.game.width,
			height: 0.1 * g.game.height,
			opacity: 0.5,
			local: true,
			touchable: true
		});
		const cancelLabel = new Label({
			scene: this,
			text: "参加キャンセル",
			font: basicFont,
			fontSize: 20,
			textColor: "white",
			textAlign: "center",
			width: 0.2 * g.game.width,
			y: 0.05 * cancelButton.height,
			local: true
		});
		cancelButton.onPointUp.add(() => {
			entryButton.cssColor = "gray";
			entryButton.modified();
			entryLabel.textColor = "white";
			entryLabel.invalidate();
			this.entry.cancel(g.game.selfId);
		});
		cancelButton.append(cancelLabel);
		entity.append(cancelButton);
	
		return entity;
	}

	private createPlayerInfoEntity(area: g.CommonArea): g.E {
		let entryCount = this.entry.getEnteredMenmberCount();
		const entity = new g.E({scene: this, width: area.width, height: area.height, x: area.x, y: area.y, local: true});
		const infoLabel = new Label({
			scene: this,
			text: `募集人数：${MAX_PLAYER_COUNT}人まで(${MIN_PLAYER_COUNT}人からプレー可)`,
			font: basicFont,
			fontSize: 36, // あくまで目安。あとで変えるかも
			textColor: "black",
			textAlign: "center",
			width: 0.8 * area.width,
			x: 0.1 * area.width,
			y: 0
		});
		entity.append(infoLabel);
		const playerCountLabel = new Label({
			scene: this,
			text: `参加希望人数：${entryCount}人`,
			font: basicFont,
			fontSize: 32, // あくまで目安。あとで変えるかも
			textColor: "black",
			textAlign: "center",
			width: 0.8 * area.width,
			x: 0.1 * area.width,
			y: 0.5 * area.height
		});
		playerCountLabel.onUpdate.add(() => {
			if (entryCount !== this.entry.getEnteredMenmberCount()) {
				entryCount = this.entry.getEnteredMenmberCount();
				playerCountLabel.text = `参加希望人数：${entryCount}人`;
				playerCountLabel.invalidate();
			}
		});
		entity.append(playerCountLabel);
		return entity;
	}

	private createSelectorEntity(area: g.CommonArea, title: string, selectorName: string, selectorItems: SelectorItem[], selected: number = 0): g.E {
		const entity = new g.E({scene: this, x: area.x, y: area.y, width: area.width, height: area.height});
		const titleLabel = new Label({
			scene: this,
			text: title,
			font: basicFont,
			fontSize: 32,
			textColor: "black",
			textAlign: "left",
			width: 0.2 * area.width,
			height: area.height
		});
		entity.append(titleLabel);
		const buttonWidth = 0.18 * area.width;
		const buttonHeight = 0.3 * buttonWidth;
		const interval = 0.05 * area.width
		const itemButtons: g.FilledRect[] = [];
		for (let i = 0; i < selectorItems.length; i++) {
			const itemButton = new g.FilledRect({
				scene: this,
				cssColor: i === selected ? "yellow" : "gray",
				x: 0.2 * area.width + i * buttonWidth + (i + 1) * interval,
				y: (area.height - buttonHeight) / 2,
				width: buttonWidth,
				height: buttonHeight,
				opacity: 0.5,
				touchable: true
			});
			const itemLabel = new Label({
				scene: this,
				text: selectorItems[i].name,
				font: basicFont,
				fontSize: 20,
				textColor: i === selected ? "red" : "white",
				textAlign: "center",
				width: itemButton.width,
				y: 0.2 * itemButton.height
			});
			itemButton.append(itemLabel);
			itemButtons.push(itemButton);
		}
		// ボタン押した時のイベントで他のボタンに影響を及ぼすためfor文を分けている
		for (let i = 0; i < itemButtons.length; i++) {
			const button = itemButtons[i];
			button.onPointUp.add(() => {
				itemButtons.forEach(b => {
					b.cssColor = "gray";
					b.modified();
					(b.children[0] as Label).textColor = "white";
					(b.children[0] as Label).invalidate();
				});
				button.cssColor = "yellow";
				button.modified();
				(button.children[0] as Label).textColor = "red";
				(button.children[0] as Label).invalidate();
				this.entry.setOptionData(selectorName, selectorItems[i].value);
			});
			entity.append(button);
		}
		// とりあえず見た目との整合性のために選択されている選択肢は内部的にもセットしておく
		if (0 <= selected && selected < selectorItems.length) {
			this.entry.setOptionData(selectorName, selectorItems[selected].value);
		}
		return entity;
	}
}
