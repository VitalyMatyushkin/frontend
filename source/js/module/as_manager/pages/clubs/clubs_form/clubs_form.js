const	React		= require('react'),
		Immutable	= require('immutable'),
		propz		= require('propz'),
		Morearty	= require('morearty');

const	Form		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field'),
		Ages		= require('module/as_manager/pages/clubs/clubs_form/components/ages'),
		Loader		= require('module/ui/loader');

const	TeamHelper	= require('module/ui/managers/helpers/team_helper'),
		ClubsConst	= require('module/helpers/consts/clubs');

const EventFormActions = require('module/as_manager/pages/events/manager/event_form/event_form_actions');

const LoaderStyle = require('styles/ui/loader.scss');

const ClubsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		this.getDefaultBinding().toJS('isSync', false);

		let school;
		window.Server.school.get(this.props.activeSchoolId).then(_school => {
			school = _school;

			return window.Server.schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}});
		}).then(forms => {
			school.forms = forms;

			if(typeof this.getDefaultBinding().toJS('ages') === 'undefined') {
				this.getDefaultBinding().set('ages', Immutable.fromJS([]));
			}
			this.getDefaultBinding().set('school', Immutable.fromJS(school));
			this.getDefaultBinding().set('isSync', true);
		});
	},
	isShowPriceNumberField: function () {
		const metaPriceTypeField = this.getDefaultBinding().sub('form').meta().toJS('priceType');

		return propz.get(metaPriceTypeField, ['value']) !== ClubsConst.PRICING.FREE;
	},
	handleChangePriceType: function () {
		if(!this.isShowPriceNumberField()) {
			this.getDefaultBinding().sub('form').meta().set('price.value', 0);
		}
	},
	handleClickAgeItem: function(ageItem) {
		const ages = this.getDefaultBinding().toJS('ages');

		const foundAgeIndex = ages.findIndex(a => a === ageItem.id);

		if(foundAgeIndex !== -1) {
			ages.splice(foundAgeIndex, 1);
		} else {
			ages.push(ageItem.id);
		}

		this.getDefaultBinding().set('ages', Immutable.fromJS(ages));
	},
	render: function() {
		let form = null;

		if(this.getDefaultBinding().toJS('isSync')) {
			form = (
				<div className ="container">
					<Form
						name			= {this.props.title}
						onSubmit		= {this.props.onFormSubmit}
						binding			= {this.getDefaultBinding().sub('form')}
						submitButtonId	= 'club_submit'
						cancelButtonId	= 'club_cancel'
					>
						<FormField
							type		= "text"
							field		= "name"
							validation	= "required"
						>
							Club name
						</FormField>
						<FormField
							type	= "text"
							field	= "description"
						>
							Description
						</FormField>
						<FormField
							field			= 'sportId'
							type			= 'autocomplete'
							defaultItem		= { this.getDefaultBinding().toJS('form.sport') }
							serviceFullData	= {
								EventFormActions.getSportService(
									this.props.activeSchoolId,
									false
								)
							}
							validation		= "required"
						>
							Sport
						</FormField>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Ages
							</div>
							<Ages
								ageGroupsNaming	= { this.getDefaultBinding().toJS('school.ageGroupsNaming') }
								availableAges	= { TeamHelper.getAges(this.getDefaultBinding().toJS('school')) }
								ages			= { this.getDefaultBinding().toJS('ages') }
								handleClickItem	= { this.handleClickAgeItem }
							/>
						</div>
						<FormField
							field		= 'priceType'
							type		= 'dropdown'
							options		= { ClubsConst.PRICING_ARRAY }
							onSelect	= { this.handleChangePriceType }
						>
							Price Type
						</FormField>
						<FormField
							field		= 'price'
							type		= 'number'
							isDisabled	= { !this.isShowPriceNumberField() }
						>
							Price
						</FormField>
					</Form>
				</div>
			);
		} else {
			form = (
				<div className='bLoaderWrapper'>
					<Loader condition={true}/>
				</div>
			);
		}

		return form;
	}
});

module.exports = ClubsForm;