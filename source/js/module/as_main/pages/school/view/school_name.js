var SchoolName;

SchoolName = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserName">School Bernhard, Langosh and Torphy</div>
		)
	}
});


module.exports = SchoolName;
