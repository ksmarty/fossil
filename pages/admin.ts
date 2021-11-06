import { Cookies } from "../dep.ts";
import { getUsers } from "../utils/auth.ts";
import toast from "./toast.ts";

export default async (cookies: Cookies) => {
	const users = JSON.stringify(await getUsers(cookies));

	return /*html*/ `<div id="Admin" class="text-white" x-data="admin()" x-cloak>
        ${toast}
    <style>
        [x-cloak] { display: none !important; }
    </style>
    <h2 class="text-2xl mb-2">Very Cool Admin Panel</h2>
    <h3 class="text-xl my-2">Manage Users</h3>

    <template x-for="({user, level}, i) in users">
        <p>
            <button @click="delUser(i)" class="mr-4">X</button><span x-text="user"></span>: Level <span x-text="level"></span>
        <p />
    </template>

    <button @click="showAddUsers = !showAddUsers" class="text-lg my-2">Add Users</button>

    <section x-show="showAddUsers" class="mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">Account settings</h2>

        <div>
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
                <div>
                    <label class="text-gray-700 dark:text-gray-200" for="user">Username</label>
                    <input id="user" type="text" x-model="newUser.user"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                </div>

                <div>
                    <label class="text-gray-700 dark:text-gray-200" for="pass">Password</label>
                    <input id="pass" type="password" x-model="newUser.pass"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                </div>

                <div>
                    <label class="text-gray-700 dark:text-gray-200" for="level">Permission Level</label>
                    <input id="level" type="number" min="1" max="3" x-model="newUser.level"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <button @click="addUser"
                    class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Add
                    user</button>
            </div>
        </div>
    </section>

    <script>
        const admin = () => ({
            users: ${users},
            showAddUsers: false,
            newUser: {
                user: "",
                pass: "",
                level: 1
            },
            async addUser() {
                let response, resCode;
                try {
                    const rawResponse = await fetch('./admin/addUser', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.newUser)
                    });

                    resCode = rawResponse.status;
                    res = await rawResponse.json();

                    this.users = [...this.users, this.newUser]

                    Alpine.store('toast').show({
                        type: (resCode === 200) ? "Success" : "Error",
                        msg: res.message,
                        visible: true
                    });

                    // Hide Toast
                    setTimeout(() => {
                        Alpine.store('toast').hide();
                    }, 2500)

                    console.log(res);
                } catch {
                    //
                }
            },
            async delUser(i) {
                let response, resCode;
                try {
                    const rawResponse = await fetch('./admin/delUser', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( this.users[i] )
                    });

                    resCode = rawResponse.status;
                    res = await rawResponse.json();

                    this.users.splice(i, 1);

                    Alpine.store('toast').show({
                        type: (resCode === 200) ? "Success" : "Error",
                        msg: res.message,
                        visible: true
                    });

                    // Hide Toast
                    setTimeout(() => {
                        Alpine.store('toast').hide();
                    }, 2500)

                    console.log(res);
                } catch {
                    //
                }
            }
        });
    </script>
</div>`;
};
