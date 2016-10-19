/**
 * Created by Anatoly on 19.10.2016.
 */

const 	React 		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		classNames 	= require('classnames');

const PlainPoints = React.createClass({
	propTypes:{
		value:		React.PropTypes.number.isRequired,
		step:		React.PropTypes.number.isRequired,
		onChange: 	React.PropTypes.func.isRequired
	},
	onClick:function(operation){
		const result = TeamHelper.operationByType(operation, this.props.value, 'plain', this.props.step);

		this.props.onChange(result);
	},
	onBlur:function(e){
		const 	value 				= e.target.value,
				validationResult 	= TeamHelper.pointsPlainValidation(value, this.props.step);

		this.setState({
			value: validationResult ? value : null,
			error: validationResult
		});

		if(!validationResult)
			this.props.onChange(value);

		e.stopPropagation();
	},
	render:function(){
		const 	error 	= !!this.state.error,
				title 	= error ? this.state.error : null,
				value 	= error ? this.state.value : this.props.value,
				classes = classNames({
										bScore: true,
										mError: error
									});

		return (
			<div className={classes}>
				<ScoreSign type="minus" handleClick={this.onClick.bind(null, 'minus')}/>
				<input className="eScore_Points"
					   title={title}
					   value={value}
					   onBlur={this.onBlur} />
				<ScoreSign type="plus" handleClick={this.onClick.bind(null, 'plus')}/>
			</div>
		);

	}
});


module.exports = PlainPoints;
