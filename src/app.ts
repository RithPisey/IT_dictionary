import express from "express";
export class Application {
	private _app: express.Application;

	constructor() {
		this._app = express();
		this.setConfig();
		this.routController();
	}

	private setConfig() {
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));
	}

	private routController() {}

	public get app() {
		return this._app;
	}
}
