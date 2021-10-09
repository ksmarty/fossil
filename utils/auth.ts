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
import { Auth, addUser, getPass } from "./db.ts";

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
	const user = body.user ?? "user";
	const pass = body.pass ?? "test123";

	const hashPass = await getPass(user);
	// Reject if user is not found
	if (!hashPass) {
		// Username wasn't found
		badLogin(res);
		return;
	}

	if (await verify(pass, hashPass)) {
		// Credentials matched.
		await cookies.set("fossil-token", await issueToken(), {
			httpOnly: true,
			sameSite: "strict",
		});
		res.body = JSON.stringify({ message: "Logged in successfully!" });
	} else {
		// Password didn't match
		badLogin(res);
	}
};

export const checkToken = async ({
	request: req,
	response: res,
	cookies,
}: {
	request: Request;
	response: Response;
	cookies: Cookies;
}) => {
	const JWT = (await cookies.get("fossil-token")) ?? "";

	try {
		// Check token
		await jwtVerify(JWT, JWK, {
			issuer: "urn:fossil:issuer",
			audience: "urn:fossil:audience",
		});

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

const badLogin = (res: Response) => {
	res.status = Status.Unauthorized;
	res.body = JSON.stringify({ message: "Invalid credentials!" });
};

const issueToken = async () => {
	return await new SignJWT({ "urn:fossil:claim": true })
		.setProtectedHeader({ alg: "HS512" })
		.setIssuedAt()
		.setIssuer("urn:fossil:issuer")
		.setAudience("urn:fossil:audience")
		.setExpirationTime("2h")
		.sign(JWK);
};

const newUser = async ({ user, pass }: Auth) => {
	const hashPass = await hash(pass);
	await addUser({ user, pass: hashPass });
};
