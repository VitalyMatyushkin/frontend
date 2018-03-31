import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as propz from 'propz';
import * as Promise from 'bluebird';
import * as InterSchoolsRivalModel from 'module/ui/managers/rival_chooser/models/inter_schools_rival_model';
import * as TeamHelper from 'module/ui/managers/helpers/team_helper';
import * as GeoSearchHelper from 'module/helpers/geo_search_helper';
import {Autocomplete} from 'module/ui/autocomplete2/OldAutocompleteWrapper';
import {SchoolListItem} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import * as SquareCrossButton from 'module/ui/square_cross_button';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';

interface SchoolsManager {
	activeSchoolId: string
}

interface SchoolsRivalModel {
	id:     string
	school: School
}

export const SchoolsManager = (React as any).createClass({
	mixins: [Morearty.Mixin],

	/**
	 * School filtering service
	 * @param schoolName
	 * @returns {*}
	 */
	schoolService: function(schoolName: string): Promise<School> {
		const	binding					= this.getDefaultBinding();

		const	activeSchool			= binding.toJS('schoolInfo'),
				activeSchoolPostcode	= activeSchool.postcode,
				rivals					= binding.toJS('rivals'),
				fartherThen				= binding.toJS('fartherThen'),
				region					= activeSchool.region;

		const filter = this.getMainSchoolFilter(rivals, schoolName);

		if(typeof region !== 'undefined') {
			filter.filter.where['region'] = region;
		}

		if(typeof activeSchoolPostcode !== 'undefined') {
			const point = activeSchoolPostcode.point;
			filter.filter.where['postcode.point'] = GeoSearchHelper.getMainGeoSchoolFilterByParams(fartherThen, point);
		} else {
			filter.filter.order = "name ASC";
		}

		let schools;
		return (window as any).Server.publicSchools.get(filter)
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

	getMainSchoolFilter: function(rivals: SchoolsRivalModel[], schoolName: string): any {
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

	getTBDSchool: function(): Promise<School> {
		const filter = {
			filter: {
				where: {
					name: { like: "TBD" }
				}
			}
		};
		return (window as any).Server.publicSchools.get(filter);
	},

	getElementTitle: function(item: SchoolsRivalModel): string {
		let name = '';

		if(typeof item.school !== 'undefined') {
			name = item.school.name;
		}

		return name;
	},

	onSelectInterSchoolsRival: function (order: string, id: string, model: School): void {
		const 	binding	= this.getDefaultBinding(),
			event	= binding.toJS('model');

		if (typeof id !== 'undefined' && typeof model !== 'undefined') {
			const rival = new InterSchoolsRivalModel(model);
			if(TeamHelper.isMultiparty(event)) {
				binding.set(`rivals.${order}`, Immutable.fromJS(rival));
			} else {
				binding.set(`rivals.1`, Immutable.fromJS(rival));
			}
		}
	},

	onClickRemoveRivalSchool: function(rivalIndex: number): void {
		const	binding	= this.getDefaultBinding();
		let		rivals	= binding.toJS('rivals');

		rivals.splice(rivalIndex, 1);

		binding.set('rivals', Immutable.fromJS(rivals));
	},

	isActiveSchoolRival: function(rival) {
		const schoolId = propz.get(rival, ['school', 'id'], undefined);

		return typeof schoolId !== 'undefined' && schoolId === this.props.activeSchoolId;
	},

	renderSelectedSchools: function(): React.ReactNode {
		const	binding	= this.getDefaultBinding()

		const	event	= binding.toJS('model'),
			rivals	= binding.toJS('rivals');

		let schools = [];
		if(TeamHelper.isMultiparty(event)) {
			schools = rivals
				.map((rival, rivalIndex) => {
					if(!this.isActiveSchoolRival(rival)) {
						return (
							<span>
							<Autocomplete
								defaultItem		= { rivals[rivalIndex] }
								serviceFilter	= { this.schoolService }
								getElementTitle	= { this.getElementTitle }
								placeholder		= "Enter school name"
								onSelect		= { this.onSelectInterSchoolsRival.bind(null, rivalIndex) }
								extraCssStyle	= "mBigSize mWidth350 mInline mRightMargin mWhiteBG"
								customListItem	= { SchoolListItem }
							/>
							<SquareCrossButton
								handleClick={this.onClickRemoveRivalSchool.bind(this, rivalIndex)}
							/>
						</span>
						);
					} else {
						return undefined;
					}
				})
				.filter(r => typeof r !== 'undefined');
		} else if(rivals.length > 1) {
			schools.push(
				<Autocomplete
					defaultItem		= { rivals[1] }
					serviceFilter	= { this.schoolService }
					getElementTitle	= { this.getElementTitle }
					placeholder		= "Enter school name"
					onSelect		= { this.onSelectInterSchoolsRival.bind(null, rivals.length) }
					extraCssStyle	= "mBigSize mWhiteBG"
					customListItem	= { SchoolListItem }
				/>
			);
		}

		return schools;
	},

	renderEmptySchoolInput: function(): React.ReactNode {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model'),
			sport	= event.sportModel,
			rivals	= binding.toJS('rivals');

		const filteredRivals = rivals.filter(rival => !this.isActiveSchoolRival(rival));

		let input;
		if(
			filteredRivals.length === 0 ||
			(
				filteredRivals.length >= 1 &&
				typeof sport !== 'undefined' &&
				TeamHelper.isMultiparty(event) &&
				(
					TeamHelper.isTeamSport(event) ||
					TeamHelper.isIndividualSport(event)
				)
			)
		) {
			// need to break element when rival length was change
			input = (
				<Autocomplete
					key				= { `empty_rival_input_${rivals.length}` }
					serviceFilter	= { this.schoolService }
					getElementTitle	= { this.getElementTitle }
					placeholder		= "Enter school name"
					onSelect		= { this.onSelectInterSchoolsRival.bind(null, rivals.length) }
					extraCssStyle	= "mBigSize mWhiteBG"
					customListItem	= { SchoolListItem }
				/>
			);
		}

		return input;
	},

	render: function() {
		const	choosers			= this.renderSelectedSchools(),
			emptySchoolInput	= this.renderEmptySchoolInput();

		if(typeof emptySchoolInput !== 'undefined') {
			choosers.push(emptySchoolInput);
		}

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