const	React		= require('react'),
		Morearty	= require('morearty');

const Popup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		stateProperty: React.PropTypes.string.isRequired,
		onRequestClose: React.PropTypes.func.isRequired,
		otherClass: React.PropTypes.string,
        initState:React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			isOpened: false
		};
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			// TODO WTF??!!
			isOpened = self.props.initState !== undefined ? self.props.initState : !!binding.get(self.props.stateProperty),
			popup_class_name = 'bPopup ' + (isOpened ? 'mAcitve' : '')+' '+(self.props.otherClass !== undefined ? self.props.otherClass:''),
			popup_back_class_name = 'bPopupBack ' + (isOpened ? 'mAcitve' : '');
        //Bind onClick event listener to div with popup_back class if you want to dismiss modal on clicking outside boundary
		if(isOpened) {
			return (
				<div>
					<div className={popup_class_name}>
						<div className="ePopup_Close" onClick={this.props.onRequestClose}></div>
						{self.props.children}
					</div>
					<div className={popup_back_class_name}></div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = Popup;



