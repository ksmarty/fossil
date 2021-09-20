// @deno-types="https://denopkg.com/soremwar/deno_types/react/v16.13.1/react.d.ts"
import React from "https://esm.sh/react@16.13.1";

export default () => {
	return (
		<html>
			<head>
				<title>Hello</title>
				<link
					href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
					rel="stylesheet"
				/>
			</head>
			<body>
				<h1 className="text-3xl m-2">That's not a file!</h1>
			</body>
		</html>
	);
};