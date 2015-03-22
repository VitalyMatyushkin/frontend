var EventGeneralView;

EventGeneralView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding();

		return <div>
            general
        </div>;
	}
});


module.exports = EventGeneralView;
