/**
 * Created by Anatoly on 17.03.2016.
 */
import * as	React from 'react';
import * as	Immutable from 'immutable';
import * as	Morearty from 'morearty';
import * as Loader from 'module/ui/loader';

import * as StudentHelper from 'module/helpers/studentHelper';

import * as StatisticView from 'module/shared_pages/student/statistic-view';

import 'styles/pages/event/b_achievement.scss';

export const AchievementOneChildWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getAndSetCurrentStudentProfile().then(() => this.addListenerToActiveChildId());
	},
	addListenerToActiveChildId: function () {
		const binding = this.getDefaultBinding();

		binding.sub('activeChildId').addListener(() => this.getAndSetCurrentStudentProfile());
	},
	getAndSetCurrentStudentProfile: function () {
		const binding = this.getDefaultBinding();

		const studentId = binding.get('activeChildId');

		binding.set('studentStatistic', Immutable.fromJS({}));
		binding.set('studentStatistic.isSync', false);
		return StudentHelper.getStudentDataForPersonalStudentPage(studentId, undefined)
			.then(studentData => {
				studentData.numberOfGamesPlayed = studentData.schoolEvent.length;
				studentData.numOfGamesWon = studentData.gamesWon.length;
				studentData.numOfGamesScoredIn = studentData.gamesScoredIn.length;


				binding.set('studentStatistic.achievements', Immutable.fromJS(studentData));
				binding.set('studentStatistic.isSync', true);

				return true;
			});
	},
	render: function () {
		const binding = this.getDefaultBinding();

		if(binding.toJS('studentStatistic.isSync')) {
			return (
				<StatisticView
					binding={binding.sub('studentStatistic')}
					type={'PARENT'}
					activeSchoolId={this.props.activeSchoolId}
				/>
			);
		} else {
			return (
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}
	}
});
