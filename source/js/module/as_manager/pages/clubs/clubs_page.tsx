import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as Route from 'module/core/route'
import * as RouterView from 'module/core/router'

import {ClubList} from "module/as_manager/pages/clubs/club_list/club_list"
import {ClubAdd} from "module/as_manager/pages/clubs/club_add"
import {ClubEdit} from "module/as_manager/pages/clubs/club_edit"

export const ClubsPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	getDefaultState() {
		return Immutable.fromJS({
			clubList: {},
			clubAdd: {
				clubsForm: {}
			},
			clubEdit: {
				clubsEditRouting: {},
				subMenuItems: {},
				clubsMainInfoEdit: {
					clubsForm: {}
				},
				clubsChildrenEdit: {},
				activateClub: {}
			},
			clubsBooking: {},
			clubsRouting: {}
		});
	},
	render() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView
				routes	= { binding.sub('clubsRouting') }
				binding	= { globalBinding }
			>
				<Route
					path			= "/clubs/clubList"
					binding			= { binding.sub('clubList') }
					activeSchoolId	= { this.props.activeSchoolId }
					component		= { ClubList }
				/>

				<Route
					path			= "/clubs/add"
					binding			= { binding.sub('clubAdd') }
					activeSchoolId	= { this.props.activeSchoolId }
					component		= { ClubAdd }
				/>

				<Route
					path			= "/clubs/editMainInfo /clubs/editChildren"
					binding			= { binding.sub('clubEdit') }
					activeSchoolId	= { this.props.activeSchoolId }
					component		= { ClubEdit }
				/>
			</RouterView>
		)
	}
});