import {} from "./dep.ts";

// Oak
import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

// Pages
import render from "./pages/render.ts";
import Home from "./pages/home.ts";
import NotFound from "./pages/not-found.ts";
import Upload from "./pages/upload.ts";

// Instantiate Oak
const app = new Application();

// Create page router
const router = new Router();
router
	// Home
	.get("/", ({ response: res }) => {
		res.body = render(Home());
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
				root: `${Deno.cwd()}`,
			});
		} catch {
			if (ctx.response.status === 404)
				ctx.response.body = "Oops! That's not a file!";
		}
	});

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
