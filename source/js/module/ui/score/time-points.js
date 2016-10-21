/**
 * Created by Anatoly on 21.10.2016.
 */

const 	React 		= require('react'),
		ScoreHelper = require('./score_helper'),
		classNames 	= require('classnames');

const PlainPoints = React.createClass({
	propTypes:{
		value:		React.PropTypes.number.isRequired,
		mask:		React.PropTypes.string.isRequired,
		onChange: 	React.PropTypes.func.isRequired
	},
	getInitialState:function(){
		return {
			error:false,
			value:this.props.value
		};
	},
	handleChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	handleBlur:function(e){
		const 	value = e.target.value,
				error = this.state.error;

		this.setState({
			value: error ? value : value*1,
			error: error
		});

		e.stopPropagation();
	},
	changeScore:function(value){
		if(/^[0-9.]+$/.test(value)){
			const validationResult = ScoreHelper.stringTimeValidation(value, this.props.mask);

			this.setState({
				value: value,
				error: validationResult
			});

			this.props.onChange({
									value: validationResult ? this.state.value*1 : value*1,
									isValid:!validationResult
								});
		}
	},
	getMask:function(mask){
		return mask;
	},
	render:function(){
		const 	error 	= !!this.state.error,
				title 	= error ? this.state.error : null,
				value 	= this.state.value,
				mask = this.getMask(this.props.mask),
				classes = classNames({
										bScore: true,
										mError: error
									});

		return (
			<div className={classes}>
				<MaskedInput title={title} value={value} className="eScore_Points"
							 onBlur={this.handleBlur} onChange={this.handleChange} mask={mask} />
			</div>
		);

	}
});


module.exports = PlainPoints;
