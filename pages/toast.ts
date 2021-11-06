export default /*html*/ `<!-- Alert -->
<div x-data="$store.toast">
    <div x-show="visible" x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="translate-x-full" x-transition:leave="transition ease-in-out duration-400"
        x-transition:leave-end="translate-x-fuller"
        class="absolute top-2 right-2 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 transition duration-500 ease-in-out transform">
        <template x-if="type === 'Success'">
            <div class="flex items-center justify-center w-12 bg-green-500">
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
            </div>
        </template>
        <template x-if="type === 'Error'">
            <div class="flex items-center justify-center w-12 bg-red-500">
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                </svg>
            </div>
        </template>

        <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
                <template x-if="type === 'Success'">
                    <span class="font-semibold text-green-500 dark:text-green-400" x-text="type"></span>
                </template>
                <template x-if="type === 'Error'">
                    <span class="font-semibold text-red-500 dark:text-red-400" x-text="type"></span>
                </template>
                <p class="text-sm text-gray-600 dark:text-gray-200" x-text="msg"></p>
            </div>
        </div>
    </div>

    <script>
        const toast = () => ({
            visible: false,
            type: '',
            msg: '',
            show ({ visible, type, msg }) {
                this.visible = visible;
                this.type = type;
                this.msg = msg;
            },
            hide () {
                this.visible = false;
            }
        });

        document.addEventListener('alpine:init', () => Alpine.store('toast', toast()));
    </script>
</div>`;
