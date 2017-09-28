const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		propz		= require('propz');

const	Button		= require('module/ui/button/button'),
		Loader		= require('module/ui/loader');

const	ActiveClubHelper	= require('module/as_manager/pages/clubs/activate_club/active_club_helper'),
		ClubsActions		= require('module/as_manager/pages/clubs/clubs_actions');

const	LoaderStyle			= require('styles/ui/loader.scss'),
		ActivateClubStyle	= require('styles/ui/b_activate_club.scss'),
		PageContentStyle	= require('styles/pages/b_page_content.scss');

const ActivateClub = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		clubId:			React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		const clubId = this.props.clubId;

		binding.set('isSync', false);
		if (typeof clubId !== 'undefined') {
			ClubsActions
				.getClub(this.props.activeSchoolId, clubId)
				.then(club => {
					binding.set('isSync', true);
					binding.set('club', Immutable.fromJS(club));
				});
		}
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();
	},
	handleClickActivateButton: function () {
		const binding = this.getDefaultBinding();

		binding.set('isSync', false);
		ClubsActions
			.acvitateClub(this.props.activeSchoolId, this.props.clubId)
			.then(() => ClubsActions.getClub(this.props.activeSchoolId, this.props.clubId))
			.then(club => {
				window.simpleAlert('The club has been activated successfully.');
				binding.set('club', Immutable.fromJS(club));
				binding.set('isSync', true);
			});
	},
	render: function() {
		const binding = this.getDefaultBinding();
		const isSync = binding.toJS('isSync');
		const clubStatus = propz.get(binding.toJS('club'), ['status']);

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
								{ActiveClubHelper.TEXT.DRAFT_TEXT[0]}
							</p>
							<p>
								{ActiveClubHelper.TEXT.DRAFT_TEXT[1]}
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
								{ActiveClubHelper.TEXT.ACTIVE_TEXT[0]}
							</p>
							<p>
								{ActiveClubHelper.TEXT.ACTIVE_TEXT[1]}
							</p>
						</div>
					</div>
				);
				break;
		}

		return content;
	}
});

module.exports = ActivateClub;