// Dependencies
import { Application, Router, everyMinute } from "./dep.ts";

// Pages
import render from "./pages/render.ts";
import Home from "./pages/home.ts";
import NotFound from "./pages/not-found.ts";
import Upload from "./pages/upload.ts";
import Admin from "./pages/admin.ts";

// Utils
import Delete, { removeFile } from "./utils/delete.ts";
import * as db from "./utils/db.ts";

// Initialize the databases
db.init();

// File Expiry
everyMinute(async () => {
	const expFiles = await db.getExpiredFiles();
	expFiles.forEach((e) => {
		removeFile(e.folder);
	});
});

// Instantiate Oak
const app = new Application();

// Create page router
const router = new Router();
router
	// Home
	.get("/", ({ response: res }) => {
		res.body = render(Home());
	})
	// Admin Panel
	.get("/admin", async ({ response: res }) => {
		res.body = render(await Admin());
	})
	// // Upload
	.post("/upload", async (ctx) => {
		ctx.response.body = render(await Upload(ctx));
	})
	// // Static files
	.get("/static/:id/:file", async (ctx) => {
		try {
			// Try to get file
			await ctx.send({
				root: ".",
			});
		} catch {
			if (ctx.response.status === 404)
				ctx.response.body = "Oops! That's not a file!";
		}
	})
	// Admin File deletion
	.delete("/delete/:id/:file", async (ctx) => await Delete(ctx))
	// URL file deletion
	.get("/delete/:id/:file", async (ctx) => await Delete(ctx));

// Enable routes
app.use(router.routes());
app.use(router.allowedMethods());

// Handle 404
app.use(({ response: res }) => {
	res.status = 404;
	res.body = render(NotFound());
});

console.log("Server started at http://localhost:8080");

// Start server
await app.listen({ port: 8080 });
