import { RouterContext, RouteParams, exists, Status, helpers } from "../dep.ts";
import { getUser } from "./auth.ts";
import { getFile, delFile } from "./db.ts";

export default async (
	ctx: RouterContext<RouteParams, Record<string, number>>
) => {
	const {
		request: req,
		response: res,
		params: { id, file },
	} = ctx;

	if (req.method !== "GET" && !(await getUser(ctx.cookies))) {
		res.body = JSON.stringify("You are not looged in!");
		res.status = Status.Unauthorized;
		return "";
	}

	let respond = {
		message: "",
		status: Status.OK,
	};

	// Check if file exists
	if (id && (await exists(`static/${id}/${file}`))) {
		// Check Deletion ID
		const dbFile = await getFile({ folder: id });
		if (helpers.getQuery(ctx).did === dbFile?.did) {
			removeFile(id);
			respond.message = "Successfully deleted";
		} else {
			respond = {
				message: "Deletion ID was incorrect!",
				status: Status.Unauthorized,
			};
		}
	} else {
		respond = {
			message: "File not found!",
			status: Status.NotFound,
		};
		console.log("Someone tried to delete a file that doesn't exist");
	}

	if (req.method === "DELETE") {
		res.body = JSON.stringify(respond.message);
		res.status = respond.status;
	}

	return /*html*/ `<div id="Login" class="text-base">
    ${respond.message}
</div>`;
};

export const removeFile = (folder: string) => {
	Deno.remove(`static/${folder}`, { recursive: true });
	delFile({ folder });
	console.log(`The file { ${folder} } was deleted.`);
};
