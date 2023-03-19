import express from "express";
import { KeywordController } from "./controller/KeywordController";
export class Application {
	private _app: express.Application;
	private keywordController: KeywordController;

	constructor() {
		this._app = express();
		this.setConfig();
		this.keywordController = new KeywordController();
		this.routController();
	}

	private setConfig() {
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));
	}

	private routController() {
		this._app.use(this.keywordController.router);
	}

	public get app() {
		return this._app;
	}
}
