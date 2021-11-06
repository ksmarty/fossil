import {
	hash,
	verify,
	Response,
	Request,
	Status,
	generateSecret,
	exportJWK,
	KeyLike,
	importJWK,
	SignJWT,
	emptyDir,
	Cookies,
	jwtVerify,
	JWTExpired,
	JWSInvalid,
	withQuery,
} from "../dep.ts";
import {
	Auth,
	addUser,
	delUser as authDelUser,
	getPass,
	getLevelDB,
	getUsersDB,
} from "./db.ts";

let JWK: KeyLike | Uint8Array;

// Get or generate JWK
(async () => {
	try {
		JWK = await importJWK(
			JSON.parse(await Deno.readTextFile("./private/key")),
			"HS512"
		);
		console.log("JWK imported successfully!");
	} catch {
		console.log("JWK doesn't exist! \nGenerating now...");
		JWK = await generateSecret("HS512", { extractable: true });
		await emptyDir("./private");
		await Deno.writeTextFile(
			"./private/key",
			JSON.stringify(await exportJWK(JWK))
		);
		console.log("JWK has been generated!");
	}
})();

export default async ({
	request: req,
	response: res,
	cookies,
}: {
	request: Request;
	response: Response;
	cookies: Cookies;
}) => {
	// Get form data
	const dataPromise = req.body({ type: "json" });
	// Read body
	const body = (await dataPromise.value) as Auth;

	// Extract login info
	const user = body.user ?? "";
	const pass = body.pass ?? "";

	const hashPass = await getPass(user);
	// Reject if user is not found
	if (!hashPass) {
		// Username wasn't found
		badLogin(res);
		return;
	}

	if (await verify(pass, hashPass)) {
		// Credentials matched.
		await cookies.set("fossil-token", await issueToken(user), {
			httpOnly: true,
			sameSite: "strict",
		});
		res.body = JSON.stringify({ message: "Logged in successfully!" });
	} else {
		// Password didn't match
		badLogin(res);
	}
};

export const loggedIn = async ({
	request: req,
	response: res,
	cookies,
}: {
	request: Request;
	response: Response;
	cookies: Cookies;
}) => {
	try {
		await checkToken(cookies);
		return true;
	} catch (e) {
		// Invalid token
		if (e instanceof JWTExpired) console.error("Token expiried");
		else if (e instanceof JWSInvalid) console.error("No token");
		else console.error(e);
	}

	// Redirect to login
	res.status = Status.TemporaryRedirect;
	res.redirect(withQuery("/login", { ref: req.url.pathname.slice(1) }));
	return false;
};

const checkToken = async (cookies: Cookies) => {
	const JWT = (await cookies.get("fossil-token")) ?? "";
	// Check token
	return await jwtVerify(JWT, JWK, {
		issuer: "urn:fossil:issuer",
		audience: "urn:fossil:audience",
	});
};

export const getUser = async (cookies: Cookies) => {
	try {
		return JSON.parse((await checkToken(cookies)).payload.sub ?? "")
			.user as string;
	} catch {
		return undefined;
	}
};

export const getLevel = async (cookies: Cookies) => {
	return (await getLevelDB(await getUser(cookies))) ?? -1;
};

export const getUsers = async (cookies: Cookies) => {
	return (await getLevel(cookies)) >= 3 ? await getUsersDB() : [];
};

const badLogin = (res: Response) => {
	res.status = Status.Unauthorized;
	res.body = JSON.stringify({ message: "Invalid credentials!" });
};

const issueToken = async (user: string) => {
	return await new SignJWT({ "urn:fossil:claim": true })
		.setProtectedHeader({ alg: "HS512" })
		.setIssuedAt()
		.setIssuer("urn:fossil:issuer")
		.setAudience("urn:fossil:audience")
		.setSubject(JSON.stringify({ user }))
		.setExpirationTime("2h")
		.sign(JWK);
};

export const newUser = async ({ user, pass, level }: Auth) => {
	const hashPass = await hash(pass);
	await addUser({ user, pass: hashPass, level });
};

export const delUser = async (user: Auth) => await authDelUser(user);
