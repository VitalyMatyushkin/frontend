import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as propz from 'propz';
import * as InterSchoolsRivalModel from 'module/ui/managers/rival_chooser/models/inter_schools_rival_model';
import * as TeamHelper from 'module/ui/managers/helpers/team_helper';
import * as GeoSearchHelper from 'module/helpers/geo_search_helper';
import {Autocomplete} from 'module/ui/autocomplete2/OldAutocompleteWrapper';
import {SchoolListItem} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import * as SquareCrossButton from 'module/ui/square_cross_button';

interface SchoolUnionSchoolsManagerProps {
	activeSchoolId: string
}

export const SchoolUnionSchoolsManager = (React as any).createClass({
	mixins: [Morearty.Mixin],

	/**
	 * School filtering service
	 * @param schoolName
	 * @returns {*}
	 */
	schoolService: function(schoolName: string): Promise<any> {
		const	binding					= this.getDefaultBinding();
		const	activeSchool			= binding.toJS('schoolInfo');
		const	activeSchoolPostcode	= activeSchool.postcode;
		const	rivals					= binding.toJS('rivals');
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
		return (window as any).Server.schoolUnionSchools.get(filter)
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

	getMainSchoolFilter: function(rivals, schoolName: string): any {
		console.log(rivals);
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

	getTBDSchool: function(): Promise<any> {
		const filter = {
			filter: {
				where: {
					name: { like: "TBD" }
				}
			}
		};
		return (window as any).Server.publicSchools.get(filter);
	},

	getElementTitle: function(item): string {
		let name = '';

		if(typeof item.school !== 'undefined') {
			name = item.school.name;
		}

		return name;
	},

	onSelectInterSchoolsRival: function (order: string, id: string, model: string): void {
		const binding = this.getDefaultBinding();

		if (typeof id !== 'undefined' && typeof model !== 'undefined') {
			const rival = new InterSchoolsRivalModel(model);
			binding.set(`rivals.${order}`, Immutable.fromJS(rival));
		}
	},

	onSelectInviterSchoolRival: function (id: string, model): void {
		const rival = new InterSchoolsRivalModel(model);
		this.getDefaultBinding().set('inviterSchool', Immutable.fromJS(rival));
	},

	onClickRemoveInviterSchool: function(): void {
		this.getDefaultBinding().set('inviterSchool', undefined);
	},

	onClickRemoveRivalSchool: function(rivalIndex: number): void {
		const	binding	= this.getDefaultBinding();
		let		rivals	= binding.toJS('rivals');

		rivals.splice(rivalIndex, 1);

		binding.set('rivals', Immutable.fromJS(rivals));
	},

	isActiveSchoolRival: function(rival): boolean {
		const schoolId = propz.get(rival, ['school', 'id'], undefined);

		return typeof schoolId !== 'undefined' && schoolId === this.props.activeSchoolId;
	},

	renderSelectedSchools: function(): React.ReactNode {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model'),
			rivals	= binding.toJS('rivals');

		// for simplify input array creation in render
		const inputs = rivals
			.map((rival, rivalIndex) => {
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
							customListItem	= { SchoolListItem }
						/>
						<SquareCrossButton
							handleClick={this.onClickRemoveRivalSchool.bind(this, rivalIndex)}
						/>
					</span>
				);
			});

		return inputs;
	},

	renderEmptySchoolInput: function(): React.ReactNode {
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
					customListItem	= { SchoolListItem }
				/>
			);
		}

		return inputs;
	},

	render: function() {
		let choosers = [];
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