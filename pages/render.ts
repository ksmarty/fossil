export default (content: string) => {
	return /*html*/ `<!DOCTYPE html>
<html lang="en" hidden>

    <head>
        <title>Fossil</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="" />

        <script defer type="module" src="https://cdn.skypack.dev/pin/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/mode=imports,min/optimized/twind/shim.js"></script>
        <script defer type="module" src="https://cdn.skypack.dev/pin/alpinejs@v3.4.1-SvvNOvUZe3QvjHhGnTyB/mode=imports,min/unoptimized/dist/cdn.min.js"></script>
    </head>

    <body>
        ${content}
    </body>

</html>`;
};
