const	React		= require('react'),
		Morearty	= require('morearty'),
		Button		= require('./../../ui/button/button');

const ConfirmAlert = React.createClass({
	mixins: [Morearty.Mixin],
	handleClickCancelButton: function() {
		const binding = this.getDefaultBinding();

		const handleClickCancelButton = binding.toJS('handleClickCancelButton');

		binding.set('isOpen', false);
		handleClickCancelButton();
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const	isOpen				= !!binding.toJS('isOpen'),
				text				= binding.toJS('text'),
				okButtonText		= binding.toJS('okButtonText'),
				cancelButtonText	= binding.toJS('cancelButtonText'),
				handleClickOkButton	= binding.toJS('handleClickOkButton');

		if(isOpen) {
			return (
				<div className="bSimpleAlert">
					<div className="eSimpleAlert_body">
						{ text }
					</div>
					<div className="eSimpleAlert_footer">
						<Button	text	= { okButtonText }
								onClick	= { handleClickOkButton }
						/>
						<Button	text	= { cancelButtonText }
								onClick	= { this.handleClickCancelButton }
						/>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = ConfirmAlert;