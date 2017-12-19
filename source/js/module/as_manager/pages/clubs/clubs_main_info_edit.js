const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	ClubForm	= require('module/as_manager/pages/clubs/clubs_form/clubs_form'),
		Loader		= require('module/ui/loader');

const	ClubsConst		= require('module/helpers/consts/clubs'),
		EventConsts		= require('module/helpers/consts/events'),
		ClubsHelper		= require('module/as_manager/pages/clubs/clubs_helper');

const	LoaderStyle	= require('styles/ui/loader.scss');

const ClubMainInfoEdit = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		clubId:			React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		const clubId = this.props.clubId;

		binding.set('isSync', false);
		let club;
		if (typeof clubId !== 'undefined') {
			window.Server.schoolClub.get(
				{
					schoolId:	this.props.activeSchoolId,
					clubId:		clubId
				}
			)
			.then(data => {
				club = data;

				return window.Server.sport.get(club.sportId);
			})
			.then(sport => {
				binding.set('isSync', true);

				binding.set('clubsForm.startDate', new Date(Immutable.fromJS(club.schedule.startDate)));
				binding.set('clubsForm.finishDate', new Date(Immutable.fromJS(club.schedule.finishDate)));
				binding.set('clubsForm.time', Immutable.fromJS(club.schedule.time));

				let days = club.schedule.days;
				if(typeof days === 'undefined') {
					days = [];
				}
				binding.set(
					'clubsForm.days',
					Immutable.fromJS(
						ClubsHelper.convertWeekDaysFromServerToClient(days)
					)
				);

				binding.set('clubsForm.ages', Immutable.fromJS(club.ages));
				binding.set('clubsForm.gender', Immutable.fromJS(EventConsts.EVENT_GENDERS[club.gender]));
				binding.set('clubsForm.sport', Immutable.fromJS(sport));
				
				club.duration = club.schedule.duration;
				binding.set('clubsForm.form', Immutable.fromJS(club));
				binding.set('clubsForm.staff', Immutable.fromJS(club.staff));
				binding.set('clubsForm.form.price', Immutable.fromJS(club.price.price));
				binding.set(
					'clubsForm.form.priceType',
					Immutable.fromJS(
						ClubsConst.SERVER_TO_CLIENT_PRICING_MAPPING[club.price.priceType]
					)
				);
			});
		}
	},
	submitEdit: function(data) {
		const 	binding 		= this.getDefaultBinding(),
				formDataDays 	= typeof this.getDefaultBinding().toJS('clubsForm.days') !== 'undefined' ? this.getDefaultBinding().toJS('clubsForm.days') : [];
		//week days is required
		if (formDataDays.length === 0) {
			binding.set('clubsForm.isRequiredErrorDays', true);
		} else {
			binding.set('clubsForm.isRequiredErrorDays', false);
			ClubsHelper.convertClientToServerFormData(
				data,
				this.getDefaultBinding().toJS('clubsForm')
			);
			window.Server.schoolClub.put(
				{
					schoolId:	this.props.activeSchoolId,
					clubId:		this.props.clubId
				},
				data
			).then(() => ClubsHelper.redirectToClubListPage());
		}
	},
	render: function() {
		const binding = this.getDefaultBinding();

		let clubForm = null;
		if(binding.toJS('isSync')) {
			clubForm = (
				<ClubForm
					title			= "Edit club..."
					activeSchoolId	= { this.props.activeSchoolId }
					onFormSubmit	= { this.submitEdit }
					binding			= { binding.sub('clubsForm') }
				/>
			)
		} else {
			clubForm = (
				<div className='bLoaderWrapper'>
					<Loader condition={true}/>
				</div>
			);
		}

		return clubForm;
	}
});

module.exports = ClubMainInfoEdit;