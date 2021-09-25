export default () => {
	return /*html*/ `<div id="Home">
	<link
		href="https://cdn.skypack.dev/-/filepond@v4.29.1-kQ2CXVKOfykYgbgQDJ5g/dist=es2020,mode=raw/dist/filepond.min.css"
		rel="stylesheet" />
	<script src="https://cdn.jsdelivr.net/npm/filepond@4.29.1/dist/filepond.min.js"
		integrity="sha256-MtMPwZlalX3/kgXUIDZkWzWNJKDKWgY802ijquF6yH0=" crossorigin="anonymous"></script>
	<h1 class="text-3xl m-2">Fossil</h1>

	<form action="/upload" method="post" enctype="multipart/form-data" x-data="{init(){
		FilePond.create($refs.input, {storeAsFile: true})
	}}">
		<input type="file" name="file" x-ref="input" />
		<br />
		<input type="submit" value="Upload"></input>
	</form>
</div>`;
};
