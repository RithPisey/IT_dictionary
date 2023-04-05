import { Request, Response, Router } from "express";
import { prisma } from "../dataSource";

export class KeywordController {
	private _router: Router;
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router.get("/fetch-keyword", async function (req, res) {
			const keywords = await prisma.keyword.findMany({
				select: {
					id: true,
					Attributes: true,
					explanation: true,
					keyword: true,
					Responsible_People: true,
					start_letter: true,
					is_new: true,
					approved_date_by_commitee: true,
				},
				orderBy: {
					start_letter: "asc",
				},
			});
			if (keywords) {
				return res.status(200).json({ msg: "success", keywords: keywords });
			} else {
				res.status(500).json({ msg: "failure" });
			}
		});
	}
	public get router() {
		return this._router;
	}
}
