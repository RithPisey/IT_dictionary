"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const express_1 = require("express");
const jwt_1 = require("../../security/jwt");
class HomeController {
    constructor() {
        this._router = (0, express_1.Router)();
        this.setRoutes();
    }
    setRoutes() {
        this._router.get("/", jwt_1.protection, function (req, res) {
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
            .post("/login", (0, jwt_1.verifyToken)({ successPath: "home" }));
        this.router.get("/logout", (req, res) => {
            res.clearCookie("utk").redirect("/");
        });
        this.router.post("/add-new-word", jwt_1.protection, function (req, res) {
            const new_word = req.body;
            console.log(new_word);
            return;
        });
    }
    get router() {
        return this._router;
    }
}
exports.HomeController = HomeController;
//# sourceMappingURL=HomeController.js.map