import {
	customAlphabet,
	nolookalikesSafe,
	emptyDir,
	parseURL,
	RouterContext,
	RouteParams,
	dayjs,
	duration,
} from "../dep.ts";
import { addFile } from "../utils/db.ts";

export default async (
	ctx: RouterContext<RouteParams, Record<string, number>>
) => {
	// Read form data
	const dataPromise = ctx.request.body({ type: "form-data" });
	// Make sure temp exists
	await emptyDir("./temp");
	// Copy file to temp dir
	const formDataBody = await dataPromise.value.read({
		outPath: "./temp",
	});
	// Parse current url
	const { protocol, host } = parseURL(ctx.request.url.toString());
	/** Relative path to the file */
	let relPath = "";
	let delLink = "";

	// Expiry
	dayjs.extend(duration);
	const exp = dayjs()
		.add(
			dayjs.duration(
				{
					"No Expiry": undefined,
					"15 min": { minutes: 15 },
					"30 min": { minutes: 30 },
					"1 hour": { hours: 1 },
					"3 hours": { hours: 3 },
					"6 hours": { hours: 6 },
					"12 hours": { hours: 12 },
					"1 day": { days: 1 },
					"3 days": { days: 3 },
					"5 days": { days: 5 },
					"1 week": { weeks: 1 },
					"2 weeks": { weeks: 2 },
				}[formDataBody.fields?.exp]
			)
		)
		.unix();
	// const exp = dayjs().add(1, "m").unix();

	if (formDataBody.files && formDataBody.files.length > 0) {
		const { filename, originalName } = formDataBody.files[0];
		// Generate unique id
		const uid = customAlphabet(nolookalikesSafe, 10)();
		// Create new folder
		await emptyDir(`static/${uid}`);
		/** Relative path to the file */
		relPath = `static/${uid}/${originalName}`;
		// Copy file from temp
		await Deno.copyFile(`${filename}`, relPath);
		// Remove temp file
		await Deno.remove(`${filename}`);
		// Add to fileDB
		delLink =
			`delete/${uid}/${originalName}?did=` +
			addFile({ folder: uid, file: `${originalName}`, exp });
	}

	return /*html*/ `
		<div id="Upload">
			<h1 class="text-3xl m-2">Successfully uploaded!</h1>
			<p class="m-2">
				View your file
				<a
					href=${protocol + "//" + host + "/" + relPath}
					class="text-purple-500 ml-1"
				>
					here
				</a>
			</p>
			<p class="m-2">
				Use this link to delete your file: ${protocol + "//" + host + "/" + delLink}
			</p>
		</div>
	`;
};
