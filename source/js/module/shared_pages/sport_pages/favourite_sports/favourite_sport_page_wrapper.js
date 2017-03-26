const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		FavouriteSportsPage	= require('module/shared_pages/sport_pages/favourite_sports/favourite_sports_page');

const SportListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getDefaultBinding().set('key', Immutable.fromJS(this.getRandomString()));
	},
	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	onReload: function() {
		this.getDefaultBinding().set('key', Immutable.fromJS(this.getRandomString()));
	},
	render: function () {
		return (
			<FavouriteSportsPage
				key			= { this.getDefaultBinding().toJS('key') }
				binding		= { this.getDefaultBinding() }
				onReload	= { this.onReload }
			/>
		);
	}
});

module.exports = SportListWrapper;