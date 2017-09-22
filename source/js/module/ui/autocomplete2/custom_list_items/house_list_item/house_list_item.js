const	React				= require ('react'),
		propz				= require ('propz'),
		HouseListItemStyle	= require('../../../../../../styles/ui/b_house_list_item.scss');

const HouseListItem = React.createClass({
	propTypes: {
		isSelected	: React.PropTypes.bool.isRequired,
		onMouseDown	: React.PropTypes.func.isRequired,
		data		: React.PropTypes.object.isRequired
	},
	getHouseColor: function() {
		if(this.hasHouseColor()) {
			return this.props.data.colors[0];
		} else {
			return '';
		}
	},
	hasHouseColor: function() {
		const colors = propz.get(this.props.data, ['colors']);

		return colors.length > 0;
	},
	hasHouseLogo: function() {
		const pic = propz.get(this.props.data, ['pic']);

		return typeof pic !== 'undefined';
	},
	renderColor: function() {
		if(this.hasHouseColor()) {
			return (
				<div className="eHouseListItem_picWrapper">
					<div
						className	= "eHouseListItem_color"
						style		= { { background: this.getHouseColor() } }
					>
					</div>
				</div>
			);
		} else {
			return null;
		}
	},
	renderHouseImage: function() {
		switch (true) {
			case this.hasHouseLogo():
				return this.renderHouseLogo();
			case this.hasHouseColor():
				return this.renderColor();
			default:
				return null;
		}
	},
	renderHouseLogo: function() {
		return (
			<div className = "eHouseListItem_picWrapper">
				<img	className	= "eHouseListItem_pic"
						src			= { this.props.data.pic }
				/>
			</div>
		);
	},
	render: function() {
		return (
			<div
				className	= "bHouseListItem"
				onMouseDown	= { this.props.onMouseDown }
			>
				<div className="eHouseListItem_wrapper">
					{ this.renderHouseImage() }
					<div className= "eHouseListItem_name">
						{ this.props.data.name }
					</div>
				</div>
			</div>
		)
	}
});

module.exports = HouseListItem;