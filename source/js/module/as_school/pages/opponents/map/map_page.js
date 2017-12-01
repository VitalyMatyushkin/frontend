const 	{If}		= require('module/ui/if/if'),
		{Map} 		= require('module/ui/map/map2'),
		React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable');

const OpponentsMapPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();

		window.Server.schoolInfo.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
		});

		window.Server.schoolOpponents.get(activeSchoolId).then(function (data) {
			binding.set('list', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bOpponentsMap" ref="map">
				<If condition={binding.get('schoolInfo.postcode.point')}>
					<Map point={binding.get('schoolInfo.postcode.point')} />
				</If>
			</div>
		)
	}
});


module.exports = OpponentsMapPage;
