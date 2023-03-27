import { Request, Response, Router } from "express";
import { protection, verifyToken } from "../../security/jwt";
import validator from "validator";
import multer, { Multer } from "multer";
import { prisma } from "../../dataSource";
import { Attributes, Responsible_People } from "@prisma/client";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "dist/public/uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname +
				"-" +
				uniqueSuffix +
				"." +
				file.originalname.split(".").pop()
		);
	},
});
const upload = multer({ storage: storage });

export class HomeController {
	private _router: Router;
	private _attributes: Attributes[] = [];
	private _res_person: Responsible_People[] = [];
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router.get("/", protection, async function (req, res) {
			const keywords = await prisma.keyword.findMany({
				select: {
					id: true,
					keyword: true,
					picture: true,
					Responsible_People: { select: { responsible_name: true } },
					explanation: true,
					start_letter: true,
					approved_date_by_commitee: true,
				},
			});

			res.render("home.ejs", { keywords: keywords });
		});
		this._router.get("/add_new_text", protection, async (req, res) => {
			const id = req.query.id;
			this._attributes = await prisma.attributes.findMany();
			this._res_person = await prisma.responsible_People.findMany();
			if (id) {
				const keyword = await prisma.keyword.findUnique({
					where: { id: parseInt(id.toLocaleString()) },
					select: {
						keyword: true,
						start_letter: true,
						Attributes: true,
						Responsible_People: true,
						explanation: true,
						approved_date_by_commitee: true,
						finally_approvied_date_by_council: true,
						description_by_commitee: true,
						description_by_councile: true,
						is_new: true,
					},
				});

				console.log(keyword);
				res.render("add_new_text", {
					errors: null,
					attributes: this._attributes,
					res_persons: this._res_person,
					keyword: keyword,
					update: true,
				});
			} else {
				res.render("add_new_text.ejs", {
					errors: null,
					attributes: this._attributes,
					res_persons: this._res_person,
					keyword: {
						id: -1,
						keyword: { kh: "", fr: "", eng: "" },
						picture: "",
						Responsible_People: { id: "", responsible_name: "" },
						explanation: "",
						start_letter: "",
						approved_date_by_commitee: "",
						is_new: true,
						Attributes: { id: "", attribute_name_kh: "" },
					},
					update: false,
				});
			}
		});

		this._router.get("/message", protection, function (req, res) {
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

		this.router.post(
			"/add-new-word",
			protection,
			upload.single("fdata"),
			async (req, res) => {
				const { kh_word, eng_word, is_new, explain } = req.body;
				// console.log("body >>> ", req.body);
				// console.log("file >>> ", req.file?.filename);

				const err = [];
				if (validator.isEmpty(kh_word)) {
					err.push("សូមបំពេញ(ពាក្យខ្មែរ)");
				}
				if (validator.isEmpty(eng_word)) {
					err.push("សូមបំពេញ(ពាក្យអង់គ្លេស)");
				}
				if (validator.isEmpty(explain)) {
					err.push("សូមបំពេញ(ការពន្យល់)");
				}

				if (err.length > 0) {
					return res.render("add_new_text", {
						errors: err,
						attributes: this._attributes,
						res_persons: this._res_person,
					});
				}
				let keyword;
				if (is_new == "true") {
					keyword = this.isNewWord(req.body, req.file?.filename, true);
				} else {
					keyword = this.isNewWord(req.body, req.file?.filename, false);
				}

				keyword.then((val) => {
					if (val) {
						return res.redirect("/");
					} else {
						res.render("add_new_text.ejs", {
							errors: ["មានអ្វីមិនស្រួលនៅក្នុងសឺវឺ"],
							attributes: this._attributes,
							res_persons: this._res_person,
						});
					}
				});

				// const utf8Encode = new TextEncoder();
				// const arr = utf8Encode.encode(bdata).buffer;
			}
		);
	}

	private async isNewWord(
		data: any,
		picture: string | undefined,
		is_new: boolean
	) {
		const {
			kh_word,
			eng_word,
			fr_word,
			attr,
			start_letter,
			res_person,
			explain,
			approved_date_by_commitee,
			desc_by_commitee,
			final_approve_date_by_council,
			desc_by_council,
		} = data;

		let keyword = await prisma.keyword.create({
			data: {
				keyword: { eng: eng_word, kh: kh_word, fr: fr_word },
				is_new: is_new,
				explanation: explain,
				responsible_PeopleId: parseInt(res_person),
				start_letter: start_letter,
				approved_date_by_commitee:
					approved_date_by_commitee == "" ? null : approved_date_by_commitee,
				attributesId: parseInt(attr),
				description_by_commitee: desc_by_commitee,
				description_by_councile: desc_by_council,
				equation: "",
				finally_approvied_date_by_council:
					final_approve_date_by_council == ""
						? null
						: final_approve_date_by_council,
				picture: picture,
			},
		});
		return keyword;
	}

	public get router() {
		return this._router;
	}
}
