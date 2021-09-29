import { RouterContext, RouteParams, exists, Status, helpers } from "../dep.ts";
import { getFile, delFile } from "./db.ts";

export default async (
	ctx: RouterContext<RouteParams, Record<string, number>>
) => {
	const {
		request: req,
		response: res,
		params: { id, file },
	} = ctx;

	// Set response status and body
	const respond = (message: string, status?: Status) => {
		if (status) res.status = status;
		res.body = req.method === "GET" ? message : JSON.stringify({ message });
	};

	// Check if file exists
	if (id && (await exists(`static/${id}/${file}`))) {
		// Check Deletion ID
		const dbFile = await getFile({ folder: id });
		if (helpers.getQuery(ctx).did === dbFile?.did) {
			removeFile(id);
			respond("Successfully deleted");
		} else {
			respond("Deletion ID was incorrect!", Status.Unauthorized);
		}
	} else {
		respond("File not found!", Status.NotFound);
		console.log("Someone tried to delete a file that doesn't exist");
	}
};

export const removeFile = (folder: string) => {
	Deno.remove(`static/${folder}`, { recursive: true });
	delFile({ folder });
	console.log(`Someone deleted the folder: ${folder}`);
};
