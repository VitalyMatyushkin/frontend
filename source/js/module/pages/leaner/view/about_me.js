var SVG = require('module/ui/svg'),
	AboutMeBlock;

AboutMeBlock = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			data = binding.toJS();

		return (
			<div className="bAboutList">
				<h6>{self.props.title || 'About me'}</h6>

				<div className="eAboutList_item"><SVG icon="icon_home" /> {binding.get('houseData.name')}</div>
				<div className="eAboutList_item"><SVG icon="icon_user-tie" /> {binding.get('classData.name')}</div>
				<div className="eAboutList_item"><SVG icon="icon_trophy" /> 0</div>
				<div className="eAboutList_item"><SVG icon="icon_teams" /> {binding.get('schoolData.name')}</div>
			</div>
		)
	}
});


module.exports = AboutMeBlock;
