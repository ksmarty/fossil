export default () => {
	return /*html*/ `<div id="Login" class="h-full flex" x-data="login()">
    <div class="z-50 w-full max-w-sm m-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div class="p-6">
            <h2 class="text-3xl font-bold text-center text-gray-700 dark:text-white">Fossil</h2>

            <!-- <h3 class="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">Welcome Back</h3> -->

            <!-- <p class="mt-1 text-center text-gray-500 dark:text-gray-400">Login or create account</p> -->

            <form>
                <div class="w-full mt-4">
                    <input
                        class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                        type="text" x-model="user" placeholder="Username" aria-label="Username" />
                </div>

                <div class="w-full mt-4">
                    <input @keyup.enter="auth()"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                        type="password" x-model="pass" placeholder="Password" aria-label="Password" />
                </div>

                <div class="flex items-center justify-between mt-4">
                    <!-- <a href="#" class="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500">Forget
                        Password?</a> -->

                    <button @click="auth()"
                        class="flex-1 px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                        type="button">Login</button>
                </div>
            </form>
        </div>

        <!-- <div class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
            <span class="text-sm text-gray-600 dark:text-gray-200">Don't have an account? </span>

            <a href="#" class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline">Register</a>
        </div> -->
    </div>

    <div x-show="toast.show" x-transition:enter="transition ease-in-out duration-350" x-transition:enter-start="translate-x-full" x-transition:leave="transition ease-in-out duration-400" x-transition:leave-end="translate-x-fuller" class="absolute top-2 right-2 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 transition duration-500 ease-in-out transform">
        <template x-if="toast.type === 'Success'">
            <div class="flex items-center justify-center w-12 bg-green-500">
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"/>
                </svg>
            </div>
        </template>
        <template x-if="toast.type === 'Error'">
            <div class="flex items-center justify-center w-12 bg-red-500">
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"/>
                </svg>
            </div>
        </template>
        
        <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
                <template x-if="toast.type === 'Success'">
                    <span class="font-semibold text-green-500 dark:text-green-400" x-text="toast.type"></span>
                </template>
                <template x-if="toast.type === 'Error'">
                    <span class="font-semibold text-red-500 dark:text-red-400" x-text="toast.type"></span>
                </template>
                <p class="text-sm text-gray-600 dark:text-gray-200" x-text="toast.msg"></p>
            </div>
        </div>
    </div>
        
    <script>
        const login = () => {
            return {
                user: '',
                pass: '',
                toast: {
                    show: false,
                    type: '',
                    msg: '',
                },
                // Call server
                async auth() {
                    const rawResponse = await fetch('./auth', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ user: this.user, pass: this.pass })
                    });

                    const resCode = rawResponse.status;
                    const response = await rawResponse.json();

                    // Setup toast
                    if (resCode === 401){
                        this.toast.type = 'Error';
                        this.toast.msg = 'Invalid credentials!'
                    } else {
                        this.toast.type = 'Success';
                        this.toast.msg = 'Logged in successfully!'
                    }

                    // Show Toast
                    this.toast.show = true;

                    // Hide Toast
                    setTimeout(()=>this.toast.show = false, 3000)
                    
                    // If the user and pass are good, give a token and redirect to where the user wanted to go
                    // Login should be called when a user tries to access a resource that is protected
                    // Otherwise, show an error
                }

            }
        }
    </script>
</div>`;
};
