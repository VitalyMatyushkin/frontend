const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		Autocomplete		= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		HouseListItem		= require('module/ui/autocomplete2/custom_list_items/house_list_item/house_list_item'),
		SquareCrossButton	= require('module/ui/square_cross_button');

const HousesManager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId : React.PropTypes.string.isRequired
	},
	houseService: function(houseName) {
		const	binding		= this.getDefaultBinding(),
				rivals		= binding.toJS('rivals');

		const	filter = {
			where: {
				name: {
					like: houseName,
					options: 'i'
				}
			},
			order:'name ASC'
		};

		const nin = rivals.map(r => r.id);
		if(nin.length !== 0) {
			filter.where.id = {
				$nin: nin
			};
		}

		return window.Server.schoolHouses.get(
			{
				schoolId:	this.props.activeSchoolId,
				filter:		filter
			}
		);
	},
	onSelectRival: function (order, id, model) {
		const binding = this.getDefaultBinding();

		if(typeof id !== 'undefined' && typeof model !== 'undefined') {
			binding.set(`rivals.${order}`, Immutable.fromJS(model));
		}
	},
	onClickRemoveHouseButton: function(rivalIndex) {
		const	binding	= this.getDefaultBinding();
		let		rivals	= binding.toJS('rivals');

		rivals.splice(rivalIndex, 1);

		binding.set('rivals', Immutable.fromJS(rivals));
	},
	render: function() {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model'),
				sport	= event.sportModel,
				rivals	= binding.toJS('rivals');

		const choosers = rivals.map((rival, rivalIndex) => {
			return (
				<span>
					<Autocomplete
						customListItem	= { HouseListItem }
						key				= { `house_input_${rivalIndex}` }
						defaultItem		= { binding.toJS(`rivals.${rivalIndex}`) }
						serviceFilter	= { this.houseService }
						serverField		= "name"
						placeholder		= "Enter house name"
						onSelect		= { this.onSelectRival.bind(null, rivalIndex) }
						extraCssStyle	= "mBigSize mWidth350 mInline mRightMargin mWhiteBG"
					/>
					<SquareCrossButton
						key			= { `cross_button_${rivalIndex}` }
						handleClick = { this.onClickRemoveHouseButton.bind(this, rivalIndex) }
					/>
				</span>
			);
		});

		if(
			rivals.length < 2 ||
			(
				rivals.length >= 2 &&
				typeof sport !== 'undefined' &&
				sport.multiparty &&
				TeamHelper.isTeamSport(event)
			)
		) {
			choosers.push(
				<Autocomplete
					customListItem={ HouseListItem }
					defaultItem={ binding.toJS(`rivals.${rivals.length}`) }
					serviceFilter={ this.houseService }
					serverField="name"
					placeholder="Enter house name"
					onSelect={ this.onSelectRival.bind(null, rivals.length) }
					extraCssStyle="mBigSize mWhiteBG"
				/>
			);
		}

		return (
			<div className="bInputWrapper">
				<div className="bInputLabel">
					Choose houses
				</div>
				{choosers}
			</div>
		);
	}
});

module.exports = HousesManager;