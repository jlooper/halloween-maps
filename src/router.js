import Vue from 'vue';
import Router from 'vue-router';

import Geo from '@/components/Geo.vue';
import List from '@/components/List.vue';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Geo,
		},
		{
			path: '/list',
			name: 'list',
			component: List,
		},
	],
});
router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		next('/');
	} else {
		next();
	}
});
export default router;
