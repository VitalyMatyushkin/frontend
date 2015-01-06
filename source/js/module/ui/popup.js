var Popup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isOpen: React.PropTypes.bool.isRequired,
		onRequestClose: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			isOpen: false
		};
	},
	componentWillReceiveProps: function(new_props) {

	},
	render: function() {
		var self = this,
			isOpen = self.getDefaultBinding().get('modalIsOpen'),
			popup_class_name = 'bPopup ' + (isOpen ? 'mAcitve' : ''),
			popup_back_class_name = 'bPopupBack ' + (isOpen ? 'mAcitve' : '');

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



