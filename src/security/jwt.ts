import { NextFunction, Request, Response } from "express";
import { validatePassword } from "../libs/passwordGenerate";
import { generateAccessToken } from "./generateToken";
import jwt from "jsonwebtoken";
import { prisma } from "../dataSource";

interface option {
	successPath?: string | null;
	failurePath?: string | null;
}

export function verifyToken(option: option) {
	return login(option.successPath, option.failurePath);
}

function login(
	successPath: string | null = null,
	failurePath: string | null = null
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const username = req.body.username;
		const password = req.body.password;
		const user = await prisma.user.findFirst({
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
		const isValidPassword = validatePassword(
			password,
			user?.hash || "",
			user?.salt || ""
		);

		if (isValidPassword && password) {
			const accessToken = generateAccessToken({
				user: user?.username,
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
	};
}

export function protection(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.utk;

	if (token && process.env.ACCESS_TOKEN_SECRET) {
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(err: any, user: any) => {
				if (err) {
					return res.sendStatus(401).render("login", {
						errMsg: "Something wrong with your authentication!",
						auth: false,
					});
				}
				res.locals.profile = user;
				console.log("protection");
				return next();
			}
		);
	} else {
		return res.status(401).render("login", {
			errMsg: "លោកអ្នកតម្រូវអោយចូលទៅកាន់គណនីរបស់អ្នកជាមុន!",
			auth: false,
		});
	}
}
