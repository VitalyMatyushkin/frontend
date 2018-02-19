import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as TeamHelper from 'module/ui/managers/helpers/team_helper';
import {Autocomplete} from 'module/ui/autocomplete2/OldAutocompleteWrapper';
import {HouseListItem} from 'module/ui/autocomplete2/custom_list_items/house_list_item/house_list_item';
import * as SquareCrossButton from 'module/ui/square_cross_button';

interface HousesManagerProps {
	activeSchoolId: string
}

interface House {
	colors:         string[]
	createdAt:      string
	description:    string
	id:             string
	name:           string
	status:         string
	statusUpdateBy: any
}

export const HousesManager = (React as any).createClass({
	mixins: [Morearty.Mixin],

	houseService: function(houseName: string): Promise<House> {
		const	binding		= this.getDefaultBinding(),
			rivals		= binding.toJS('rivals');

		let filter;
		const nin = rivals.map(r => r.id);

		if(nin.length !== 0) {
			filter = {
				where: {
					name: {
						like: houseName,
						options: 'i'
					},
					id: {
						$nin: nin
					}
				},
				order:'name ASC'
			}
		} else {
			filter = {
				where: {
					name: {
						like: houseName,
						options: 'i'
					}
				},
				order:'name ASC'
			};
		}

		return (window as any).Server.schoolHouses.get(
			{
				schoolId:	this.props.activeSchoolId,
				filter:		filter
			}
		);
	},

	onSelectRival: function (order: string, id: string, model: House): void {
		const binding = this.getDefaultBinding();

		if(typeof id !== 'undefined' && typeof model !== 'undefined') {
			binding.set(`rivals.${order}`, Immutable.fromJS(model));
		}
	},

	onClickRemoveHouseButton: function(rivalIndex: number): void {
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
				(
					TeamHelper.isTeamSport(event) ||
					TeamHelper.isIndividualSport(event)
				)
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