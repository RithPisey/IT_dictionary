"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const KeywordController_1 = require("./controller/KeywordController");
const HomeController_1 = require("./mc/controller/HomeController");
class Application {
    constructor() {
        this._app = (0, express_1.default)();
        this.setConfig();
        this.keywordController = new KeywordController_1.KeywordController();
        this.homeController = new HomeController_1.HomeController();
        this.routController();
    }
    setConfig() {
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.static(path_1.default.join(__dirname + "/public")));
        this._app.set("views", path_1.default.join(__dirname + "/views"));
        this._app.set("view engine", "ejs");
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: false }));
        this._app.use((0, cookie_parser_1.default)());
        this._app.use((0, express_session_1.default)({
            secret: ["any long secret key"],
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 14,
                httpOnly: true,
                secure: false,
                sameSite: true,
            },
        }));
    }
    routController() {
        // REST API
        this._app.use("/api", this.keywordController.router);
        // MVC
        this._app.use(this.homeController.router);
    }
    get app() {
        return this._app;
    }
}
exports.Application = Application;
//# sourceMappingURL=app.js.map