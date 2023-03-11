"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const express_1 = __importDefault(require("express"));
class Application {
    constructor() {
        this._app = (0, express_1.default)();
        this.setConfig();
        this.routController();
    }
    setConfig() {
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: true }));
    }
    routController() { }
    get app() {
        return this._app;
    }
}
exports.Application = Application;
//# sourceMappingURL=app.js.map