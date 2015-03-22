var EventEditView;

EventEditView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding();

		return <div>
            edit
        </div>;
	}
});


module.exports = EventEditView;
