import { hash, verify, Response, Request, Status } from "../dep.ts";
import { Auth, addUser, getPass } from "./db.ts";

export default async ({ req, res }: { req: Request; res: Response }) => {
	// Read form data
	const dataPromise = req.body({ type: "text" });
	// Read body
	const body = JSON.parse(await dataPromise.value) as Auth;

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
		res.body = JSON.stringify({ message: "Logged in successfully!" });
	} else {
		// Password didn't match
		badLogin(res);
	}
};

const badLogin = (res: Response) => {
	res.status = Status.Unauthorized;
	res.body = JSON.stringify({ message: "Invalid credentials!" });
};

const newUser = async ({ user, pass }: Auth) => {
	const hashPass = await hash(pass);
	await addUser({ user, pass: hashPass });
};
