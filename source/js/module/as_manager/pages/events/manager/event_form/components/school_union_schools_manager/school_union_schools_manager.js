const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		propz					= require('propz'),
		InterSchoolsRivalModel	= require('module/ui/managers/rival_chooser/models/inter_schools_rival_model'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		GeoSearchHelper			= require('module/helpers/geo_search_helper'),
		Autocomplete			= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		SchoolItemList			= require('module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		SquareCrossButton		= require('module/ui/square_cross_button');

const SchoolUnionSchoolsManager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	/**
	 * School filtering service
	 * @param schoolName
	 * @returns {*}
	 */
	schoolService: function(schoolName) {
		const	binding					= this.getDefaultBinding();

		const	activeSchool			= binding.toJS('schoolInfo');
		const	activeSchoolPostcode	= activeSchool.postcode;
		const	rivals					= binding.toJS('rivals');
		if(this.isInviterSchoolExist()) {
			rivals.push(
				this.getDefaultBinding().toJS('inviterSchool')
			);
		}
		const	fartherThen				= binding.toJS('fartherThen');

		const filter = this.getMainSchoolFilter(
			rivals,
			schoolName
		);
		filter.schoolUnionId = this.props.activeSchoolId;
		if(typeof activeSchoolPostcode !== 'undefined') {
			const point = activeSchoolPostcode.point;
			filter.filter.where['postcode.point'] = GeoSearchHelper.getMainGeoSchoolFilterByParams(fartherThen, point);
		} else {
			filter.filter.order = "name ASC";
		}

		let schools;
		return window.Server.schoolUnionSchools.get(filter)
			.then(_schools => {
				schools = _schools;

				return this.getTBDSchool();
			})
			.then(data => {
				if(data.length > 0 && data[0].name === "TBD") {
					// set TBD school at first
					schools.unshift(data[0]);
				}
				return schools;
			});
	},
	getMainSchoolFilter: function(rivals, schoolName) {
		return {
			filter: {
				where: {
					id: {
						$nin: rivals.map(r => r.school.id)
					},
					name: { like: schoolName }
				},
				limit: 40
			}
		};
	},
	getTBDSchool: function() {
		const filter = {
			filter: {
				where: {
					name: { like: "TBD" }
				}
			}
		};
		return window.Server.publicSchools.get(filter);
	},
	getElementTitle: function(item) {
		let name = '';

		if(typeof item.school !== 'undefined') {
			name = item.school.name;
		}

		return name;
	},
	isInviterSchoolExist: function () {
		return typeof this.getDefaultBinding().toJS('inviterSchool') !== 'undefined';
	},
	onSelectInterSchoolsRival: function (order, id, model) {
		const binding = this.getDefaultBinding();

		if (typeof id !== 'undefined' && typeof model !== 'undefined') {
			const rival = new InterSchoolsRivalModel(model);
			binding.set(`rivals.${order}`, Immutable.fromJS(rival));
		}
	},
	onSelectInviterSchoolRival: function (id, model) {
		const rival = new InterSchoolsRivalModel(model);
		this.getDefaultBinding().set('inviterSchool', Immutable.fromJS(rival));
	},
	onClickRemoveInviterSchool: function() {
		this.getDefaultBinding().set('inviterSchool', undefined);
	},
	onClickRemoveRivalSchool: function(rivalIndex) {
		const	binding	= this.getDefaultBinding();
		let		rivals	= binding.toJS('rivals');

		rivals.splice(rivalIndex, 1);

		binding.set('rivals', Immutable.fromJS(rivals));
	},
	isActiveSchoolRival: function(rival) {
		const schoolId = propz.get(rival, ['school', 'id']);

		return typeof schoolId !== 'undefined' && schoolId === this.props.activeSchoolId;
	},
	renderInviterSchool: function() {
		const binding = this.getDefaultBinding();

		// for simplify input array creation in render
		const inputs = [];

		if(this.isInviterSchoolExist()) {
			const inviterSchool = binding.toJS('inviterSchool');

			inputs.push(
				<span>
					<Autocomplete
						key				= { 'inviter_school_autocomplete' }
						defaultItem		= { inviterSchool }
						serviceFilter	= { this.schoolService }
						getElementTitle	= { this.getElementTitle }
						placeholder		= "Enter inviter school name"
						onSelect		= { this.onSelectInviterSchoolRival }
						extraCssStyle	= "mBigSize mWidth350 mInline mRightMargin mWhiteBG"
						customListItem	= { SchoolItemList }
					/>
					<SquareCrossButton
						handleClick	= { this.onClickRemoveInviterSchool }
					/>
				</span>
			);
		} else {
			inputs.push(
				<Autocomplete
					key				= { 'empty_inviter_school_autocomplete' }
					serviceFilter	= { this.schoolService }
					getElementTitle	= { this.getElementTitle }
					placeholder		= "Enter inviter school name"
					onSelect		= { this.onSelectInviterSchoolRival }
					extraCssStyle	= "mBigSize mWhiteBG mBottomMargin"
					customListItem	= { SchoolItemList }
				/>
			);
		}

		return inputs;
	},
	renderSelectedSchools: function() {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model'),
				rivals	= binding.toJS('rivals');

		// for simplify input array creation in render
		const inputs = rivals
			.map((rival, rivalIndex) => {
				if(TeamHelper.isMultiparty(event)) {
					return (
						<span>
							<Autocomplete
								key				= { `invited_school_autocomplete_${rivalIndex}` }
								defaultItem		= { rivals[rivalIndex] }
								serviceFilter	= { this.schoolService }
								getElementTitle	= { this.getElementTitle }
								placeholder		= "Enter invited school name"
								onSelect		= { this.onSelectInterSchoolsRival.bind(null, rivalIndex) }
								extraCssStyle	= "mBigSize mWidth350 mInline mRightMargin mWhiteBG"
								customListItem	= { SchoolItemList }
							/>
							<SquareCrossButton
								handleClick={this.onClickRemoveRivalSchool.bind(this, rivalIndex)}
							/>
						</span>
					);
				} else {
					return (
						<Autocomplete
							key				= { `simple_invited_school_autocomplete_${rivalIndex}` }
							defaultItem		= { rivals[rivalIndex] }
							serviceFilter	= { this.schoolService }
							getElementTitle	= { this.getElementTitle }
							placeholder		= "Enter invited school name"
							onSelect		= { this.onSelectInterSchoolsRival.bind(null, rivals.length) }
							extraCssStyle	= "mBigSize mWhiteBG"
							customListItem	= { SchoolItemList }
						/>
					);
				}
			});

		return inputs;
	},
	renderEmptySchoolInput: function() {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model'),
				sport	= event.sportModel,
				rivals	= binding.toJS('rivals');

		// for simplify input array creation in render
		const inputs = [];

		if(
			rivals.length <= 1 ||
			(
				rivals.length >= 1 &&
				typeof sport !== 'undefined' &&
				TeamHelper.isMultiparty(event) &&
				(
					TeamHelper.isTeamSport(event) ||
					TeamHelper.isIndividualSport(event)
				)
			)
		) {
			// need to break element when rival length was change
			inputs.push(
				<Autocomplete
					key				= { `empty_rival_input_${rivals.length}` }
					serviceFilter	= { this.schoolService }
					getElementTitle	= { this.getElementTitle }
					placeholder		= "Enter invited school name"
					onSelect		= { this.onSelectInterSchoolsRival.bind(null, rivals.length) }
					extraCssStyle	= "mBigSize mWhiteBG"
					customListItem	= { SchoolItemList }
				/>
			);
		}

		return inputs;
	},
	render: function() {
		let choosers = [];
		// choosers = choosers.concat(this.renderInviterSchool());
		choosers = choosers.concat(this.renderSelectedSchools());
		choosers = choosers.concat(this.renderEmptySchoolInput());

		return (
			<div className="bInputWrapper">
				<div className="bInputLabel">
					Choose schools
				</div>
				{choosers}
			</div>
		);
	}
});

module.exports = SchoolUnionSchoolsManager;