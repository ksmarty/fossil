import { getAllFiles } from "../utils/db.ts";

export default async () => {
	const files = JSON.stringify(await getAllFiles());

	return /*html*/ `<div id="Admin">
    <h2 class="text-2xl">Very cool admin panel</h2>
    <div x-data='{files: ${files}}'>
        <template x-for="file in files">
            <div>
                <button @click="()=>deleteFile(file.folder, file.name, file.did)">Delete</button>
                <p x-text="file.name"></p>
            </div>
        </template>
    </div>
    <script>
        const deleteFile = async (folder, file, did) => {
            const res = await fetch(\`/delete/\${folder}/\${file}?did=\${did}\`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(await res.json());
        }
    </script>
</div>`;
};
