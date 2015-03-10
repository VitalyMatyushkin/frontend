var EventView;

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
			routerParameters = rootBinding.toJS('routing.parameters');

		window.Server.eventFindOne.get({
			filter: {
				where: {id: routerParameters.id},
				include: ['sport', 'participants']
			}
		}).then(function (res) {
			binding.set('eventInfo', Immutable.fromJS(res));
		});
    },
	getRival: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			rival = binding.sub('eventInfo.participants.' + order);

		return <div className="eEvent_rival">
			<span className="eEvent_rival">{rival.get('name')}</span>
		</div>;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            routerParameters = rootBinding.toJS('routing.parameters'),
            eventInfo = binding.sub('eventInfo');

		return <div className="bEvents">
            <div className="bEvent">
                <h2 className="eEvent_title">{eventInfo.get('name')}</h2>
				<div className="eEvent_rivals">
					{self.getRival(0)}
					<div className="eEvent_result">
						<span className="eEvent_score">0:0</span>
					</div>
					{self.getRival(1)}
				</div>
                <div className="eEvent_description">{eventInfo.get('description')}</div>
                <div className="eEvent_type">Type: {eventInfo.get('type')}</div>
            </div>
		</div>;
	}
});


module.exports = EventView;
