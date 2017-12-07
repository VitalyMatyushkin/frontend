const	React		= require('react'),
		Morearty	= require('morearty'),
		{Button}	= require('../button/button');

const NotificationAlert = React.createClass({
	mixins: [Morearty.Mixin],
	
	handleClickOkButton: function() {
		const binding = this.getDefaultBinding();

		const handleClickOkButton = binding.toJS('handleClickOkButton');

		binding.set('isOpen', false);
		handleClickOkButton();
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const	isOpen			= !!binding.toJS('isOpen'),
				text			= binding.toJS('text'),
				okButtonText	= binding.toJS('okButtonText');

		if(isOpen) {
			return (
				<div className="bSimpleAlert_bg">
					<div className="bSimpleAlert">
						<div className="eSimpleAlert_body">
							{text}
						</div>
						<div className="eSimpleAlert_footer">
							<Button text={ okButtonText }
									onClick={ this.handleClickOkButton }
									extraStyleClasses={ 'mFullWidth' }
								/>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = NotificationAlert;