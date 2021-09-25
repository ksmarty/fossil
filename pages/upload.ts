import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { nolookalikesSafe } from "https://esm.sh/nanoid-dictionary@5.0.0-beta.1";
import { emptyDir } from "https://deno.land/std@0.107.0/fs/mod.ts";
import { parseURL } from "https://esm.sh/ufo@0.7.9";
import {
	RouterContext,
	RouteParams,
} from "https://deno.land/x/oak@v9.0.1/router.ts";

export default async (
	ctx: RouterContext<RouteParams, Record<string, number>>
) => {
	// Read form data
	const dataPromise = ctx.request.body({ type: "form-data" });
	// Copy file to temp dir
	const formDataBody = await dataPromise.value.read({
		outPath: "./temp",
	});
	// Parse current url
	const { protocol, host } = parseURL(ctx.request.url.toString());
	/** Relative path to the file */
	let relPath = "";

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
		</div>
	`;
};
