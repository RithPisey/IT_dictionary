"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const express_1 = require("express");
const jwt_1 = require("../../security/jwt");
const validator_1 = __importDefault(require("validator"));
const multer_1 = __importDefault(require("multer"));
const dataSource_1 = require("../../dataSource");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "dist/public/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname +
            "-" +
            uniqueSuffix +
            "." +
            file.originalname.split(".").pop());
    },
});
const upload = (0, multer_1.default)({ storage: storage });
class HomeController {
    constructor() {
        this._attributes = [];
        this._res_person = [];
        this._router = (0, express_1.Router)();
        this.setRoutes();
    }
    setRoutes() {
        this._router.get("/", jwt_1.protection, function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const keywords = yield dataSource_1.prisma.keyword.findMany({
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
                if (keywords) {
                    res.render("home", { keywords: keywords });
                }
                else {
                    res.render("home", { keywords: [] });
                }
            });
        });
        this._router.get("/add_new_text", jwt_1.protection, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            this._attributes = yield dataSource_1.prisma.attributes.findMany();
            this._res_person = yield dataSource_1.prisma.responsible_People.findMany();
            if (id) {
                const keyword = yield dataSource_1.prisma.keyword.findUnique({
                    where: { id: parseInt(id.toLocaleString()) },
                    select: {
                        id: true,
                        keyword: true,
                        start_letter: true,
                        Attributes: true,
                        Responsible_People: true,
                        explanation: true,
                        approved_date_by_commitee: true,
                        finally_approvied_date_by_council: true,
                        description_by_commitee: true,
                        description_by_councile: true,
                        picture: true,
                        is_new: true,
                    },
                });
                res.render("add_new_text", {
                    errors: null,
                    attributes: this._attributes,
                    res_persons: this._res_person,
                    keyword: keyword,
                    update: true,
                });
            }
            else {
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
        }));
        this._router.get("/message", jwt_1.protection, function (req, res) {
            res.render("message.ejs");
        });
        this.router.get("/delete-keyword", jwt_1.protection, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            if (id) {
                const keyword = yield dataSource_1.prisma.keyword.delete({
                    where: { id: parseInt(id === null || id === void 0 ? void 0 : id.toLocaleString()) },
                });
                if (keyword) {
                    res.redirect("/");
                }
                else {
                    res.render("error", { error: "Cannot delete" });
                }
            }
            else {
                res.render("error", { error: "Cannot delete" });
            }
        }));
        this._router
            .get("/login", function (req, res) {
            res.render("login", { errMsg: null });
        })
            .post("/login", (0, jwt_1.verifyToken)({ successPath: "home" }));
        this.router.get("/logout", (req, res) => {
            res.clearCookie("utk").redirect("/");
        });
        this.router.post("/add-new-word", jwt_1.protection, upload.single("fdata"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { kh_word, eng_word, is_new, explain } = req.body;
            // console.log("body >>> ", req.body);
            // console.log("file >>> ", req.file?.filename);
            const err = [];
            if (validator_1.default.isEmpty(kh_word)) {
                err.push("សូមបំពេញ(ពាក្យខ្មែរ)");
            }
            if (validator_1.default.isEmpty(eng_word)) {
                err.push("សូមបំពេញ(ពាក្យអង់គ្លេស)");
            }
            if (validator_1.default.isEmpty(explain)) {
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
                keyword = this.isNewWord(req.body, (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename, true);
            }
            else {
                keyword = this.isNewWord(req.body, (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename, false);
            }
            keyword.then((val) => {
                if (val) {
                    return res.redirect("/");
                }
                else {
                    res.render("add_new_text.ejs", {
                        errors: ["មានអ្វីមិនស្រួលនៅក្នុងសឺវឺ"],
                        attributes: this._attributes,
                        res_persons: this._res_person,
                    });
                }
            });
            // const utf8Encode = new TextEncoder();
            // const arr = utf8Encode.encode(bdata).buffer;
        }));
        this.router.post("/update-keyword", jwt_1.protection, upload.single("fdata"), (req, res) => {
            var _a, _b;
            const id = req.query.id;
            if (id == "0") {
                res.render("error", { error: "Something wrong!" });
            }
            const { kh_word, eng_word, is_new, explain } = req.body;
            const err = [];
            if (validator_1.default.isEmpty(kh_word)) {
                err.push("សូមបំពេញ(ពាក្យខ្មែរ)");
            }
            if (validator_1.default.isEmpty(eng_word)) {
                err.push("សូមបំពេញ(ពាក្យអង់គ្លេស)");
            }
            if (validator_1.default.isEmpty(explain)) {
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
                keyword = this.isNewWord(req.body, (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename, true, id === null || id === void 0 ? void 0 : id.toLocaleString());
            }
            else {
                keyword = this.isNewWord(req.body, (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename, false, id === null || id === void 0 ? void 0 : id.toLocaleString());
            }
            keyword.then((val) => {
                if (val) {
                    return res.redirect("/");
                }
                else {
                    res.render("add_new_text.ejs", {
                        errors: ["មិនអាចកែរប្រែបានទេ។ សូមត្រួតពិនិត្យម្ដងទៀត!"],
                        attributes: this._attributes,
                        res_persons: this._res_person,
                    });
                }
            });
        });
    }
    isNewWord(data, picture, is_new, id = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const { kh_word, eng_word, fr_word, attr, start_letter, res_person, explain, approved_date_by_commitee, desc_by_commitee, final_approve_date_by_council, desc_by_council, } = data;
            let keyword;
            if (id.length === 0) {
                console.log("is create");
                keyword = yield dataSource_1.prisma.keyword.create({
                    data: {
                        keyword: { eng: eng_word, kh: kh_word, fr: fr_word },
                        is_new: is_new,
                        explanation: explain,
                        responsible_PeopleId: parseInt(res_person),
                        start_letter: start_letter,
                        approved_date_by_commitee: approved_date_by_commitee == ""
                            ? null
                            : new Date(approved_date_by_commitee),
                        attributesId: parseInt(attr),
                        description_by_commitee: desc_by_commitee,
                        description_by_councile: desc_by_council,
                        equation: "",
                        finally_approvied_date_by_council: final_approve_date_by_council == ""
                            ? null
                            : new Date(final_approve_date_by_council),
                        picture: picture,
                    },
                });
            }
            else {
                console.log("is update");
                keyword = dataSource_1.prisma.keyword.update({
                    where: { id: parseInt(id === null || id === void 0 ? void 0 : id.toLocaleString()) },
                    data: {
                        keyword: { eng: eng_word, kh: kh_word, fr: fr_word },
                        is_new: is_new,
                        explanation: explain,
                        responsible_PeopleId: parseInt(res_person),
                        start_letter: start_letter,
                        approved_date_by_commitee: approved_date_by_commitee == ""
                            ? null
                            : new Date(approved_date_by_commitee),
                        attributesId: parseInt(attr),
                        description_by_commitee: desc_by_commitee,
                        description_by_councile: desc_by_council,
                        equation: "",
                        finally_approvied_date_by_council: final_approve_date_by_council == ""
                            ? null
                            : new Date(final_approve_date_by_council),
                        picture: picture,
                    },
                });
            }
            return keyword;
        });
    }
    get router() {
        return this._router;
    }
}
exports.HomeController = HomeController;
//# sourceMappingURL=HomeController.js.map