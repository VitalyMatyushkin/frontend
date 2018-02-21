import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from'immutable'
import * as propz from'propz'

import {Button}	from 'module/ui/button/button'
import * as Loader from 'module/ui/loader'

import {ActiveClubHelper} from 'module/as_manager/pages/clubs/activate_club/active_club_helper'
import {ClubsActions} from 'module/as_manager/pages/clubs/clubs_actions'
import {ActivateClubConfirmAlert} from "module/as_manager/pages/clubs/activate_club/activate_club_confirm_alert";

const LoaderStyle = require('styles/ui/loader.scss');
const ActivateClubStyle	= require('styles/ui/b_activate_club.scss');
const PageContentStyle	= require('styles/pages/b_page_content.scss');

export const ActivateClub = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	(React as any).PropTypes.string.isRequired,
		clubId:			(React as any).PropTypes.string.isRequired
	},
	componentWillMount() {
		const binding = this.getDefaultBinding();

		const clubId = this.props.clubId;

		binding.set('isSync', false);
		if (typeof clubId !== 'undefined') {
			ClubsActions
				.getClub(this.props.activeSchoolId, clubId)
				.then(club => {
					binding.set('club', Immutable.fromJS(club));
					binding.set('isSync', true);

					// return ClubsActions.getAcceptableUsers(this.props.activeSchoolId, this.props.clubId);
				});
				// .then(users => {
				// 	binding.set('clubAcceptableUsers', Immutable.fromJS(users));
				// 	binding.set('isSync', true);
				//
				// 	return true;
				// });
		}
	},
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	handleClickActivateButton() {
		const binding = this.getDefaultBinding();

		(window as any).confirmAlert(
			<ActivateClubConfirmAlert club={binding.toJS('club')} clubAcceptableUsers={binding.toJS('clubAcceptableUsers')}/>,
			"Ok",
			"Cancel",
			() => {
				binding.set('isSync', false);

				ClubsActions
					.activateClub(this.props.activeSchoolId, this.props.clubId)
					.then(() => ClubsActions.getClub(this.props.activeSchoolId, this.props.clubId))
					.then(club => {
						window.simpleAlert('The club has been activated successfully.');

						binding.set('club', Immutable.fromJS(club));
						binding.set('isSync', true);
					});
			}
		);
	},
	render() {
		const binding = this.getDefaultBinding();
		const isSync = binding.toJS('isSync');
		const clubStatus = propz.get(binding.toJS('club'), ['status'], undefined);

		let content = null;
		switch(true) {
			case !isSync:
				content = (
					<div className='bLoaderWrapper'>
						<Loader condition={true}/>
					</div>
				);
				break;
			case clubStatus === 'DRAFT':
				content = (
					<div className='bPageContent'>
						<div className='bActivateClub'>
							<h2>
								Activate club
							</h2>
							<p>
								{ActiveClubHelper.DRAFT_TEXT[0]}
							</p>
							<p>
								{ActiveClubHelper.DRAFT_TEXT[1]}
							</p>
							<Button
								text	= "Activate Club"
								onClick	= { this.handleClickActivateButton }
							/>
						</div>
					</div>
				);
				break;
			case clubStatus === 'ACTIVE':
				content = (
					<div className='bPageContent'>
						<div className='bActivateClub'>
							<h2>
								Activate club
							</h2>
							<p>
								{ActiveClubHelper.ACTIVE_TEXT[0]}
							</p>
							<p>
								{ActiveClubHelper.ACTIVE_TEXT[1]}
							</p>
						</div>
					</div>
				);
				break;
		}

		return content;
	}
});