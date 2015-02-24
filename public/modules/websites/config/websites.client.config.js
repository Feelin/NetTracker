'use strict';

// Configuring the Websites module
angular.module('websites').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '网站', 'websites', 'dropdown', '/websites(/create)?');
		Menus.addSubMenuItem('topbar', 'websites', '网站列表', 'websites');
		Menus.addSubMenuItem('topbar', 'websites', '添加网站', 'websites/create');
	}
]);