import { Request, Response, Router } from "express";
import { protection, verifyToken } from "../../security/jwt";
import { prisma } from "../../dataSource";

export class HomeController {
	private _router: Router;
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router.get("/", protection, function (req, res) {
			res.render("home.ejs");
		});
		this._router.get("/add_new_text", function (req, res) {
			res.render("add_new_text.ejs");
		});

		this._router.get("/message", function (req, res) {
			res.render("message.ejs");
		});
		this._router
			.get("/login", function (req, res) {
				res.render("login", { errMsg: null });
			})
			.post("/login", verifyToken({ successPath: "home" }));
		this.router.get("/logout", (req: Request, res: Response) => {
			res.clearCookie("utk").redirect("/");
		});

		this.router.post("/add-new-word", protection, function (req, res) {
			const new_word = req.body;
			console.log(new_word);
			return;
		});
	}
	public get router() {
		return this._router;
	}
}
