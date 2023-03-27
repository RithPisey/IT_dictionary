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
exports.protection = exports.verifyToken = void 0;
const passwordGenerate_1 = require("../libs/passwordGenerate");
const generateToken_1 = require("./generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataSource_1 = require("../dataSource");
function verifyToken(option) {
    return login(option.successPath, option.failurePath);
}
exports.verifyToken = verifyToken;
function login(successPath = null, failurePath = null) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const user = yield dataSource_1.prisma.user.findFirst({
            where: { username: username, is_active: true },
            select: {
                hash: true,
                username: true,
                salt: true,
            },
        });
        if (!user) {
            return res.render("login", {
                errMsg: "Something wrong with your authentication!",
                auth: false,
            });
        }
        const isValidPassword = (0, passwordGenerate_1.validatePassword)(password, (user === null || user === void 0 ? void 0 : user.hash) || "", (user === null || user === void 0 ? void 0 : user.salt) || "");
        if (isValidPassword && password) {
            const accessToken = (0, generateToken_1.generateAccessToken)({
                user: user === null || user === void 0 ? void 0 : user.username,
                password: password,
            });
            if (successPath) {
                return res
                    .cookie("utk", accessToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                    secure: false,
                    sameSite: true,
                })
                    .redirect("/");
            }
        }
    });
}
function protection(req, res, next) {
    const token = req.cookies.utk;
    if (token && process.env.ACCESS_TOKEN_SECRET) {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(401).render("login", {
                    errMsg: "Something wrong with your authentication!",
                    auth: false,
                });
            }
            res.locals.profile = user;
            console.log("protection");
            return next();
        });
    }
    else {
        return res.status(401).render("login", {
            errMsg: "លោកអ្នកតម្រូវអោយចូលទៅកាន់គណនីរបស់អ្នកជាមុន!",
            auth: false,
        });
    }
}
exports.protection = protection;
//# sourceMappingURL=jwt.js.map