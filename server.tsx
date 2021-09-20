// @deno-types="https://denopkg.com/soremwar/deno_types/react/v16.13.1/react.d.ts"
import "https://esm.sh/react@16.13.1";
// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://esm.sh/react-dom@16.13.1/server";
import {
	Application,
	Router,
	send,
} from "https://deno.land/x/oak@v9.0.1/mod.ts";

// Pages
import Home from "./pages/home.tsx";
import NotFound from "./pages/not-found.tsx";

const render = (jsx: () => JSX.Element) => ReactDOMServer.renderToString(jsx());

// app.post("/upload", async (req, res) => {
// 	if (req.is("multipart/form-data")) {
// 		res.json(req.body);
// 		console.log(await req.body());
// 	}
// });

// Instantiate Oak
const app = new Application();

// Create page router
const router = new Router();
router
	.get("/", ({ response: res }) => {
		res.body = render(Home);
	})
	.get("/static/:id/:file", async (ctx) => {
		try {
			await send(
				ctx,
				ctx.request.url.pathname.replace(/^[\/]static/, ""),
				{
					root: `${Deno.cwd()}/static`,
				}
			);
		} catch {
			if (ctx.response.status === 404)
				ctx.response.body = render(NotFound);
		}
	});

// Enable routes
app.use(router.routes());
app.use(router.allowedMethods());

// Handle 404
app.use(({ response: res }) => {
	res.status = 404;
	res.body = render(NotFound);
});

console.log("Server started at http://localhost:8080");

// Start server
await app.listen({ port: 8080 });
