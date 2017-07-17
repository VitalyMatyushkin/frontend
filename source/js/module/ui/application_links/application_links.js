/**
 * Created by Woland on 17.07.2017.
 */
const 	React 		= require('react'),
		Morearty	= require('morearty');

const ApplicationLinksStyles = require('styles/ui/b_application_links/b_application_links.scss');

const ApplicationLinks = React.createClass({
	propTypes: {
		onClickWebVersion: 		React.PropTypes.func.isRequired,
		onClickIOSVersion: 		React.PropTypes.func.isRequired,
		onClickAndroidVersion: 	React.PropTypes.func.isRequired
	},
	render: function(){
		return (
			<div>
				<div className = "bApplicationLinks">
					<div
						className = "eApplicationLink mIOS"
						onClick = {this.props.onClickIOSVersion}
					>
					</div>
					<div
						className = "eApplicationLink mAndroid"
						onClick = {this.props.onClickAndroidVersion}
					>
					</div>
				</div>
				<hr className="eApplicationLinkSeparator" />
				<div
					className = "eWebLink mWeb"
					onClick = {this.props.onClickWebVersion}
				>
					Continue with web version
				</div>
			</div>
		);
	}
});

module.exports = ApplicationLinks;