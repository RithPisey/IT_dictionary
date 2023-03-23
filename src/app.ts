import express from "express";
import session from "express-session";
import path from "path";
import cookiesParser from "cookie-parser";
import { KeywordController } from "./controller/KeywordController";
import { HomeController } from "./mc/controller/HomeController";
export class Application {
	private _app: express.Application;
	// REST API
	private keywordController: KeywordController;

	// MVC
	private homeController: HomeController;

	constructor() {
		this._app = express();
		this.setConfig();
		this.keywordController = new KeywordController();
		this.homeController = new HomeController();
		this.routController();
	}

	private setConfig() {
		this._app.use(express.json());
		this._app.use(express.static(path.join(__dirname + "/public")));
		this._app.set("views", path.join(__dirname + "/views"));
		this._app.set("view engine", "ejs");
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: false }));
		this._app.use(cookiesParser());
		this._app.use(
			session({
				secret: ["any long secret key"],
				resave: false,
				saveUninitialized: false,
				cookie: {
					maxAge: 1000 * 60 * 60 * 24 * 14,
					httpOnly: true,
					secure: false,
					sameSite: true,
				},
			})
		);
	}

	private routController() {
		// REST API
		this._app.use("/api", this.keywordController.router);

		// MVC
		this._app.use(this.homeController.router);
	}

	public get app() {
		return this._app;
	}
}
