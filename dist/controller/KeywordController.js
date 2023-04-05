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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordController = void 0;
const express_1 = require("express");
const dataSource_1 = require("../dataSource");
class KeywordController {
    constructor() {
        this._router = (0, express_1.Router)();
        this.setRoutes();
    }
    setRoutes() {
        this._router.get("/fetch-keyword", function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const keywords = yield dataSource_1.prisma.keyword.findMany({
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
                }
                else {
                    res.status(500).json({ msg: "failure" });
                }
            });
        });
    }
    get router() {
        return this._router;
    }
}
exports.KeywordController = KeywordController;
//# sourceMappingURL=KeywordController.js.map