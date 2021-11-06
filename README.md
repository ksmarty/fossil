# Fossil

A self-hosted static file server for Docker built with Deno.

Run with `deno run -q --allow-net=0.0.0.0:8080 --allow-read=. --unstable server.tsx`

If [denon](https://github.com/denosaurs/denon) is installed, run `denon start`

## Features

-   [x] Statically serve files
-   [x] Choose file expiry date
    -   [ ] Set default expiry
-   [x] Drag & Drop file upload
-   [x] Delete files via secret link
-   [x] Dashboard for managing files
    -   [x] Password protection

## Permission Levels

0. Able to upload
1. View/delete files you've uploaded (Default)
2. View/delete all uploaded files
3. Create/modify accounts

## Resources

-   [Oak Upload File Example](https://github.com/elycheikhsmail/oak_upload_file)
-   Favicon made by [Freepik](https://www.freepik.com) from [flaticon.com](https://www.flaticon.com/)
