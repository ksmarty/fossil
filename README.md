# Fossil

A self-hosted static file server for Docker built with Deno.

Run with `deno run -q --allow-net=0.0.0.0:8080 --allow-read=. --unstable server.tsx`

## Features

-   [x] Statically serve files
-   [ ] Choose file expiry date
    -   [ ] Set default expiry
-   [ ] Drag & Drop file upload
-   [ ] Delete files via secret link (enable/disable via env)
-   [ ] Admin panel for managing files
    -   [ ] Password protection

## Resources

-   [Writing a React SSR app in Deno](https://dev.to/craigmorten/writing-a-react-ssr-app-in-deno-2m7)
-   [Generate HTML on the server with Deno and JSX](https://roeland.moors.org/deno/jsx/2021/04/03/generate-html-with-deno-and-jsx.html)
-   [Oak Upload File Example](https://github.com/elycheikhsmail/oak_upload_file)