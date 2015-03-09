var EventView;

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            routerParameters = rootBinding.toJS('routing.parameters'),
            found = binding.get('models').find(function (model) {
                return model.get('id') === routerParameters.id;
            });

        if (!found) {
            window.Server.event.get(routerParameters.id, {
                filter: {
                    include: ['sport', 'participants']
                }
            }).then(function (res) {
                binding.set('eventInfo', Immutable.fromJS(res));
            });
        } else {
            binding.set('eventInfo', found);
        }
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
                <div className="eEvent_description">{eventInfo.get('description')}</div>
                <div className="eEvent_type">Type: {eventInfo.get('type')}</div>
            </div>
		</div>;
	}
});


module.exports = EventView;
