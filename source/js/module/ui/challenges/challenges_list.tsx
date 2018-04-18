import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as InvitesMixin from 'module/as_manager/pages/invites/mixins/invites_mixin';
import * as MoreartyHelper from 'module/helpers/morearty_helper';
import	{DateHelper} from '../../helpers/date_helper';
import {Challenges} from './challenges';

export const ChallengesList = (React as any).createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function () {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		this._initBinding();
		this._addListeners();
	},

	_initBinding: function (): void {
		const	binding		= this.getDefaultBinding(),
				selectDay	= binding.get('calendar.selectDay');

		if(selectDay !== undefined && selectDay !== null) {
			this._setFixturesByDate(selectDay.date);
		} else {
			binding.set('selectedDayFixtures', Immutable.fromJS([]));
		}
	},

	_addListeners: function(): void {
		const binding = this.getDefaultBinding();

		binding.sub('calendar.selectDay').addListener((descriptor) => {
			this._setFixturesByDate(descriptor.getCurrentValue().date);
		});

		binding.sub('models').addListener(() => {
			const currentCalendarDate = binding.toJS('calendar.selectDay');

			currentCalendarDate && this._setFixturesByDate(currentCalendarDate.date);
		});
	},

	_setFixturesByDate: function (date): void {
		const	binding	= this.getDefaultBinding(),
				sync	= binding.toJS('sync') && binding.toJS('sports.sync');
		let		selectedDayFixture = [];

		if(sync) {
			const allFixtures = binding.toJS('models');

			if(allFixtures && allFixtures.length != 0) {

				selectedDayFixture = allFixtures.filter((event) => {
					const eventDate = DateHelper.getDateStringFromDateObject(new Date(event.startTime)),
						currentDate = DateHelper.getDateStringFromDateObject(date);

					return currentDate == eventDate;
				});
			}
		}

		binding.set('selectedDayFixtures', Immutable.fromJS(selectedDayFixture));
	},

	_onClickEvent: function (eventId: string): void {
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},

	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				isSync			= binding.toJS('sync'),
				selectedDay		= binding.get('calendar.selectDay'),
				isDaySelected	= typeof selectedDay !== 'undefined' || selectedDay !== null,
				events			= binding.toJS('selectedDayFixtures');

		return (
			<Challenges
				isSync			= { isSync }
				isDaySelected	= { isDaySelected }
				activeSchoolId	= { this.activeSchoolId }
				onClick			= { this._onClickEvent }
				events			= { events }
			/>
		);
	}
});