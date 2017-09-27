const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),
		propz		= require('propz');

const	DateSelector				= require('module/ui/date_selector/date_selector'),
		FullTimeInput				= require('module/ui/full_time_input/full_time_input'),
		MultiselectDropdown			= require('module/ui/multiselect-dropdown/multiselect_dropdown');

const ClubsHelper = require('module/as_manager/pages/clubs/clubs_helper');

const DateSelectorWrapperStyle = require('styles/ui/b_date_selector_wrapper.scss');

const Shedule = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		let startDate = binding.toJS('startDate');
		if(typeof startDate === 'undefined') {
			startDate = new Date();
			binding.set('startDate', Immutable.fromJS(startDate));
		}

		let finishDate = binding.toJS('finishDate');
		if(typeof finishDate === 'undefined') {
			finishDate = new Date();
			binding.set('finishDate', Immutable.fromJS(finishDate));
		}

		let time = binding.toJS('time');
		if(typeof time === 'undefined') {
			time = new Date();
			binding.set('time', Immutable.fromJS(time));
		}

		let days = binding.toJS('days');
		if(typeof days === 'undefined') {
			binding.set('days', Immutable.fromJS([]));
		}
	},
	
	handleChangeMinutes: function(minute) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
				dateObject = new Date(timeString);

		dateObject.setMinutes(minute);

		binding.set('time', dateObject.toISOString());
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return(
			<div>
				
			</div>
		);
	}
});

module.exports = Shedule;