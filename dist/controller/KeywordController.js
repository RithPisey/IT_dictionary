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
                    res.status(200).json({ msg: "failure" });
                }
            });
        });
        this._router.post("/set-device-id", function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { did } = req.body;
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
                const device_id = yield dataSource_1.prisma.devices.findUnique({
                    where: {
                        device_id: did,
                    },
                });
                if (!device_id) {
                    const device = yield dataSource_1.prisma.devices.create({
                        data: { device_id: did },
                    });
                    if (keywords) {
                        return res.status(200).json({ msg: "success", keywords: keywords });
                    }
                    else {
                        res.status(200).json({ msg: "failure" });
                    }
                }
                else {
                    if (keywords) {
                        return res.status(200).json({ msg: "success", keywords: keywords });
                    }
                    else {
                        res.status(200).json({ msg: "failure" });
                    }
                }
            });
        });
        this._router.post("/check-saved-keyword", function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { kid, did } = req.body;
                const keyword = yield dataSource_1.prisma.keyword_device.findFirst({
                    where: {
                        device_id: did,
                        keyword_id: kid,
                    },
                    select: {
                        keyword: true,
                    },
                });
                if (keyword) {
                    return res.status(200).json({ issaved: true });
                }
                else {
                    return res.status(200).json({ issaved: false });
                }
            });
        });
        this._router.post("/save-keyword", function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { kid, did } = req.body;
                const kd = yield dataSource_1.prisma.keyword_device.findFirst({
                    where: {
                        device_id: did,
                        keyword_id: kid,
                    },
                    select: {
                        id: true,
                    },
                });
                if (!kd) {
                    const keyword_device = yield dataSource_1.prisma.keyword_device.create({
                        data: {
                            device_id: did,
                            keyword_id: kid,
                        },
                    });
                    if (keyword_device) {
                        return res.status(200).json({ save: true });
                    }
                    else {
                        return res.status(200).json({ fail: false });
                    }
                }
                else {
                    return res.status(200).json({ fail: false });
                }
            });
        });
        this._router.post("/saved-keyword", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { did } = req.body;
            const keyword_device = yield dataSource_1.prisma.keyword_device.findMany({
                where: {
                    device_id: did,
                },
                select: {
                    keyword: true,
                },
            });
            if (keyword_device) {
                return res
                    .status(200)
                    .json({ msg: "success", keywords: keyword_device });
            }
            else {
                res.status(200).json({ msg: "failure" });
            }
        }));
        this._router.post("/unsaved-keyword", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { kid, did } = req.body;
            const kd = yield dataSource_1.prisma.keyword_device.findFirst({
                where: {
                    device_id: did,
                    keyword_id: kid,
                },
                select: {
                    id: true,
                },
            });
            if (kd) {
                const keyword_device = yield dataSource_1.prisma.keyword_device.delete({
                    where: {
                        id: kd,
                    },
                });
                if (keyword_device) {
                    res.status(200).json({ msg: "deleted", isDleted: true });
                }
                else {
                    res.status(200).json({ msg: "Cannot delete", isDleted: false });
                }
            }
            else {
                res.status(200).json({ msg: "Cannot delete", isDleted: false });
            }
        }));
    }
    get router() {
        return this._router;
    }
}
exports.KeywordController = KeywordController;
//# sourceMappingURL=KeywordController.js.map