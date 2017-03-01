/**
 * Created by Woland on 15.01.2017.
 * Component which show list of roles to join
 */

const 	React 		= require('react'),
		classNames 	= require('classnames');

const 	types 			= ['parent', 'admin', 'manager', 'teacher', 'coach', 'student'],
		visibleTypes 	= ['Parent', 'School Admin', 'School Manager', 'PE Teacher', 'Coach', 'Student'];

const PermissionRoleSelector = React.createClass({
	propTypes: {
		onClickType: 	React.PropTypes.func.isRequired,
		currentType:	React.PropTypes.string
	},
	render: function() {
		const currentType = typeof this.props.currentType !== 'undefined' ? this.props.currentType : '';
		return (
			<div className="eRegistration_chooser">
				{types.map( (type, i) => {
					const itemClasses = classNames({
						eRegistration_chooserItem: 	true,
						mActive: 					type === currentType
					});

					return (
						<div key={type} className={itemClasses}>
							<div className="eChooserItem_wrap" onClick={() => this.props.onClickType(type)}>
								<div className="eChooserItem_inside"></div>
							</div>
							<span className="eRegistration_chooserTitle" onClick={() => this.props.onClickType(type)}>{visibleTypes[i]}</span>
						</div>
					);
				})}
			</div>
		)
	}
});

module.exports = PermissionRoleSelector;