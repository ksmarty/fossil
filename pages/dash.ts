import { Cookies } from "../dep.ts";
import { getLevel, getUser } from "../utils/auth.ts";
import { getAllFiles } from "../utils/db.ts";
import toast from "./toast.ts";

export default async (cookies: Cookies) => {
	// If user is admin, get all files
	const files = JSON.stringify(
		await getAllFiles(await getUser(cookies), await getLevel(cookies))
	);

	return /*html*/ `<div id="Dash" class="text-white" x-data="dash()">
    ${toast}

    <h2 class="text-2xl mb-2">Very Cool Dashboard</h2>
    <div>
        <template x-for="file in files">
            <div>
                <button @click="deleteFile(file)">Delete</button>
                <span x-text="file.file"></span>
            </div>
        </template>
    </div>

    <script>
        const dash = () => ({
            files: ${files},
            async deleteFile({folder, file, did}) {
                const rawResponse = await fetch("/delete/" + folder + "/" + file + "?did=" + did, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const resCode = rawResponse.status;
                const res = await rawResponse.json();

                if (resCode === 401) window.location.reload();

                if (resCode === 200) {
                    const dex = this.files.map(e => e.folder).indexOf(folder);
                    if (dex > -1) this.files.splice(dex, 1);
                }

                Alpine.store('toast').show({
                    type: (resCode === 200) ? "Success" : "Error",
                    msg: res,
                    visible: true
                });

                // Hide Toast
                setTimeout(() => {
                    Alpine.store('toast').hide();
                }, 2500)
            }
        });
    </script>
</div>`;
};
