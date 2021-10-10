// Dependencies
import { Application, Router, everyMinute, Status } from "./dep.ts";

// Pages
import render from "./pages/render.ts";
import Home from "./pages/home.ts";
import NotFound from "./pages/not-found.ts";
import Upload from "./pages/upload.ts";
import Dash from "./pages/dash.ts";
import Login from "./pages/login.ts";

// Utils
import Delete, { removeFile } from "./utils/delete.ts";
import { initFiles, initAuth, getExpiredFiles } from "./utils/db.ts";
import Auth, { loggedIn } from "./utils/auth.ts";

// Initialize the databases
initFiles();
initAuth();

// File Expiry
everyMinute(async () => {
	const expFiles = await getExpiredFiles();
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
	.get("/dash", async (ctx) => {
		if (!(await loggedIn(ctx))) return;
		else ctx.response.body = render(await Dash(ctx.cookies));
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
	.get(
		"/delete/:id/:file",
		async (ctx) => (ctx.response.body = render(await Delete(ctx)))
	)
	.get(
		"/login",
		({ response: res, request: req }) => (res.body = render(Login(req)))
	)
	.post("/auth", async (ctx) => await Auth(ctx));

// Enable routes
app.use(router.routes());
app.use(router.allowedMethods());

// Public Files & Handle 404
app.use(async (ctx) => {
	// Check if the requested resource is in public. If not, return a 404.
	try {
		await ctx.send({
			root: "./public",
		});
	} catch {
		ctx.response.status = Status.NotFound;
		ctx.response.body = render(NotFound());
	}
});

console.log("Server started at http://localhost:8080");

// Start server
await app.listen({ port: 8080 });
