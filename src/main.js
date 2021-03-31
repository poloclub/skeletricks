import App from './App.svelte';
import { gen_main_header } from './utils/header.js'
import { gen_selector } from './utils/selector.js'
import { gen_bottom } from './utils/bottom.js'

const app = new App({
	target: document.body,
	props: {
	}
});

gen_main_header()
gen_selector()
gen_bottom()

export default app;