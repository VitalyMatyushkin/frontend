const	React		= require('react'),
		Morearty	= require('morearty'),
		Button		= require('./../../ui/button/button');

/**
 * Alert window used for confirmation dialogue.
 * Will show some text with Ok|Cancel buttons
 */
const ConfirmAlert = React.createClass({
	mixins: [Morearty.Mixin],
	onCancelButtonClick: function() {
		const binding = this.getDefaultBinding();

		const handleClickCancelButton = binding.toJS('handleClickCancelButton');

		binding.set('isOpen', false);
		handleClickCancelButton();
	},
	onOkButtonClick: function() {
		const 	binding			= this.getDefaultBinding(),
				okButtonHandler	= binding.toJS('handleClickOkButton');

		binding.set('isOpen', false);
		okButtonHandler();
	},
	render: function() {
		const 	binding				= this.getDefaultBinding(),
				isOpen				= !!binding.toJS('isOpen'),
				text				= binding.toJS('text'),
				okButtonText		= binding.toJS('okButtonText'),
				cancelButtonText	= binding.toJS('cancelButtonText');

		if(isOpen) {
			return (
				<div className="bSimpleAlert_bg">
					<div className="bSimpleAlert">
						<div className="eSimpleAlert_body">
							{ text }
						</div>
						<div className="eSimpleAlert_footer">
							<Button text={ cancelButtonText }
									onClick={ this.onCancelButtonClick }
									extraStyleClasses={ 'mCancel mHalfWidth  mMarginRight' }
								/>
							<Button text={ okButtonText }
									onClick={ this.onOkButtonClick }
									extraStyleClasses={ 'mHalfWidth' }
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

module.exports = ConfirmAlert;