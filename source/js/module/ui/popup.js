var Popup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		stateProperty: React.PropTypes.string.isRequired,
		onRequestClose: React.PropTypes.func.isRequired
	},
	getDefaultProps: function () {
		return {
			isOpened: false
		};
	},
	render: function() {
		var self = this,
			isOpened = self.getDefaultBinding().get(self.props.stateProperty),
			popup_class_name = 'bPopup ' + (isOpened ? 'mAcitve' : ''),
			popup_back_class_name = 'bPopupBack ' + (isOpened ? 'mAcitve' : '');

		return (
			<div>
				<div className={popup_class_name}>
					<div className="ePopup_Close" onClick={this.props.onRequestClose}></div>
					{self.props.children}
				</div>
				<div className={popup_back_class_name} onClick={this.props.onRequestClose}></div>
			</div>
		)
	}
});

module.exports = Popup;



