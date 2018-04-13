import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import * as userDataInstance from 'module/data/user_data';
import {Application} from "module/as_blog/application";
import {ServiceList} from "module/core/service_list/service_list";
import {authController} from "module/core/auth_controller";

import 'styles/ui/blog/b_blog_container.scss'

export function asBlog() {
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: userDataInstance.getDefaultState(),
			routing: {
				currentPath: '',
				currentPageName: '',
				currentPathParts: [],
				pathParameters: [],
				parameters: {}
			}
		},
		options: {
			requestAnimationFrameEnabled: true
		}
	});

	const binding = MoreartyContext.getBinding();

	window.Server = new ServiceList(binding.sub('userData'));

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			// setting context binding to data classes
			userDataInstance.setBinding(binding.sub('userData'));

			authController.initialize({
					binding: binding,
					asBlog: true
				})
				.then(() => {
					ReactDom.render(
						React.createElement(MoreartyContext.bootstrap(Application), null),
						document.getElementById('jsMain')
					);
				});
		});
}