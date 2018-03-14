// general components
import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as Route from 'module/core/route'
import * as RouterView from 'module/core/router'

// components
import {DashboardMainPage} from "module/as_manager/pages/dashboard/dashboard_main_page/dashboard_main_page";

export const Dashboard = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	getDefaultState() {
		return Immutable.fromJS({
			dashboardMainPage: {}
		});
	},
	render() {
		const binding = this.getDefaultBinding();
		const globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView
				routes={binding.sub('dashboardRouting')}
				binding={globalBinding}
			>
				<Route
					path="/dashboard/mainPage"
					binding={binding.sub('dashboardMainPage')}
					activeSchoolId={this.props.activeSchoolId}
					component={DashboardMainPage}
				/>
			</RouterView>
		)
	}
});