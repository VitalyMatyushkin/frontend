var EventFinishView;

EventFinishView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding();

		return <div>
            finish
        </div>;
	}
});


module.exports = EventFinishView;
