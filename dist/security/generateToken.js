"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateAccessToken(user) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (secret) {
        return jsonwebtoken_1.default.sign(user, secret, {
            expiresIn: "30d",
        });
    }
    else {
        return null;
    }
}
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=generateToken.js.map