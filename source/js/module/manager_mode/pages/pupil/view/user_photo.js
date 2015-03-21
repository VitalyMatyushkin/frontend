var UserPhoto;

UserPhoto = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserPhoto mIsMe">
				<img src={binding.get('avatar') || '/images/user.jpg'} className="eUserPhoto_image" />
			</div>
		)
	}
});


module.exports = UserPhoto;
