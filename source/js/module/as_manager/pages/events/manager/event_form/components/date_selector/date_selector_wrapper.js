const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		DateSelector				= require('../../../../../../../ui/date_selector/date_selector'),
		DateSelectorWrapperStyle	= require('../../../../../../../../../styles/ui/b_date_selector_wrapper.scss');

const DateSelectorWrapper = React.createClass({
	mixins: [Morearty.Mixin],

	handleChangeDate: function(date) {
		this.getDefaultBinding().set(Immutable.fromJS(date));
	},

	render: function() {
		const date = this.getDefaultBinding().toJS();

		return(
			<div className="bDateSelectorWrapper">
				<DateSelector	date				= { date }
								handleChangeDate	= { this.handleChangeDate }
				/>
			</div>
		);
	}
});

module.exports = DateSelectorWrapper;