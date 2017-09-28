const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	ClubForm	= require('module/as_manager/pages/clubs/clubs_form/clubs_form'),
		Loader		= require('module/ui/loader');

const	ClubsConst	= require('module/helpers/consts/clubs'),
		ClubsHelper	= require('module/as_manager/pages/clubs/clubs_helper');

const LoaderStyle = require('styles/ui/loader.scss');

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
		if (typeof clubId !== 'undefined') {
			window.Server.schoolClub.get(
				{
					schoolId:	this.props.activeSchoolId,
					clubId:		clubId
				}
			).then(data => {
				binding.set('isSync', true);

				binding.set('clubsForm.startDate', Immutable.fromJS(data.startDate));
				binding.set('clubsForm.finishDate', Immutable.fromJS(data.finishDate));
				binding.set('clubsForm.time', Immutable.fromJS(data.time));

				let days = data.days;
				if(typeof days === 'undefined') {
					days = [];
				}
				binding.set(
					'clubsForm.days',
					Immutable.fromJS(
						ClubsHelper.convertWeekDaysFromServerToClient(days)
					)
				);

				binding.set('clubsForm.ages', Immutable.fromJS(data.ages));
				binding.set('clubsForm.form', Immutable.fromJS(data));
				binding.set('clubsForm.form.price', Immutable.fromJS(data.price.price));
				binding.set(
					'clubsForm.form.priceType',
					Immutable.fromJS(
						ClubsConst.SERVER_TO_CLIENT_PRICING_MAPPING[data.price.priceType]
					)
				);
			});
		}
	},
	submitEdit: function(data) {
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
		).then(() => this.redirectToClubListPage());
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