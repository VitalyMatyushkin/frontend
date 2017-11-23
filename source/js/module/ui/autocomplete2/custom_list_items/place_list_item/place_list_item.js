const	React				= require ('react'),
	{If}				= require ('../../../if/if'),
		PlaceListItemStyle	= require('../../../../../../styles/ui/b_place_list_item.scss');

const PlaceListItem = React.createClass({
	propTypes: {
		isSelected	: React.PropTypes.bool.isRequired,
		onMouseDown	: React.PropTypes.func.isRequired,
		data		: React.PropTypes.object.isRequired
	},
	/**
	 * props.place can be place or can be postcode.
	 * @param place
	 * @returns {boolean}
	 */
	isPlace: function() {
		return typeof this.props.data.name !== 'undefined';
	},
	getPostcodeTooltip: function() {
		return typeof this.props.data.tooltip !== 'undefined' ? this.props.data.tooltip : '';
	},
	renderPostcode: function() {
		return (
			<div	className	= "bPlaceListItem"
					onMouseDown	= {this.props.onMouseDown}
			>
				{`${this.props.data.postcode} `}
				<span className="ePlaceListItem_tooltipText">{this.getPostcodeTooltip()}</span>
			</div>
		);
	},
	renderPlace: function() {
		return (
			<div	className	= "bPlaceListItem"
					onMouseDown	= {this.props.onMouseDown}
			>
				{`${this.props.data.name} `}
				<span className="ePlaceListItem_tooltipText">{`(${this.props.data.postcode})`}</span>
			</div>
		);
	},
	render: function() {
		return this.isPlace() ? this.renderPlace() : this.renderPostcode();
	}
});

module.exports = PlaceListItem;