import { walkSync } from "../dep.ts";

export default () => {
	const files = JSON.stringify(
		[...walkSync("static", { includeDirs: false })].map((e) => e.path)
	);

	return /*html*/ `<div id="Admin">
    <h2 class="text-2xl">Very cool admin panel</h2>
    <div x-data='{files: ${files}}'>
        <template x-for="file in files">
            <div>
                <button @click="()=>deleteFile(file)">Delete</button>
                <p x-text="file"></p>
            </div>
        </template>
    </div>
    <script>
        const deleteFile = (fileName) => {
            fetch("/delete", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({fileName})
            })
        }
    </script>
</div>`;
};
