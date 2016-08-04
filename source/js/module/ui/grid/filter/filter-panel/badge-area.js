/**
 * Created by Anatoly on 31.07.2016.
 */
const   Badge = require('./badge'),
		React = require('react');

const BadgeArea = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object.isRequired
	},
	componentWillMount:function(){
		const 	model 	= this.props.model;

		model.onChange = this.onChange;
	},
	onChange:function(){
		this.setState({model:this.props.model});
	},
	render: function() {
		const 	model 	= this.props.model,
				badges 	= model.badges;

		return (
			<div className="bBadgeArea">
					{Object.keys(badges).map((key, index) => {
						const badge = badges[key];
						return <Badge key={index} model={badge} />;
					})}
			</div>
		);
	}
});

module.exports = BadgeArea;