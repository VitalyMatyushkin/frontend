/**
 * Created by Woland on 15.01.2017.
 * Component which show list of roles to join
 */

const 	React 		= require('react'),
		classNames 	= require('classnames');

const 	types 			= ['parent', 'admin', 'manager', 'teacher', 'coach'],
		visibleTypes 	= ['Parent', 'School Admin', 'School Manager', 'PE Teacher', 'Coach'];

const PermissionRoleSelector = React.createClass({
	propTypes: {
		onClickType: 	React.PropTypes.func.isRequired,
		currentType:	React.PropTypes.string
	},
	render: function() {
		return (
			<div className="eRegistration_chooser">
				{types.map( (type, i) => {
					const itemClasses = classNames({
						eRegistration_chooserItem: 	true,
						mActive: 					this.props.currentType === type
					});

					return (
						<div key={type} className={itemClasses} onClick={this.props.onClickType}>
							<div className="eChooserItem_wrap">
								<div className="eChooserItem_inside"></div>
							</div>
							<span className="eRegistration_chooserTitle">{visibleTypes[i]}</span>
						</div>
					);
				})}
			</div>
		)
	}
});

module.exports = PermissionRoleSelector;