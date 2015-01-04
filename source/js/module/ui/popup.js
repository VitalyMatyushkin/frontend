var Popup = React.createClass({
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
			popup_class_name = 'bPopup ' + (self.props.isOpen ? 'mAcitve' : ''),
			popup_back_class_name = 'bPopupBack ' + (self.props.isOpen ? 'mAcitve' : '');

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



