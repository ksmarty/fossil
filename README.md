# Fossil

A self-hosted static file server for Docker built with Deno.

Run with `deno run -q --allow-net=0.0.0.0:8080 --allow-read=. --unstable server.tsx`

## Features

-   [x] Statically serve files
-   [ ] Choose file expiry date
    -   [ ] Set default expiry
-   [x] Drag & Drop file upload
-   [ ] Delete files via secret link (enable/disable via env)
-   [x] Admin panel for managing files
    -   [ ] Password protection

## Resources

-   [Oak Upload File Example](https://github.com/elycheikhsmail/oak_upload_file)
