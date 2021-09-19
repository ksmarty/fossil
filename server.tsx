// @deno-types="https://denopkg.com/soremwar/deno_types/react/v16.13.1/react.d.ts"
import "https://esm.sh/react@16.13.1";
// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://esm.sh/react-dom@16.13.1/server";
import { opine } from "https://deno.land/x/opine@1.7.2/mod.ts";
import Home from "./pages/home.tsx";

function render(jsx: () => JSX.Element) {
  return ReactDOMServer.renderToString(jsx());
}

const app = opine();

app.get("/", function (req: Opine.Request, res: Opine.Response) {
  res.send(render(Home));
});

app.listen({ port: 8080 }, () => {
  console.log("Server started on http://localhost:8080");
});
