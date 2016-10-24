/**
 * Created by Anatoly on 24.10.2016.
 */

const 	React 		= require('react'),
		ScoreHelper = require('./score_helper'),
		MaskedInput = require('module/ui/masked_input'),
		classNames 	= require('classnames');

const MaskedPoints = React.createClass({
	propTypes:{
		value:			React.PropTypes.number.isRequired,
		mask:			React.PropTypes.string.isRequired,
		onChange: 		React.PropTypes.func.isRequired,
		/**
		 * Convert string value to points according to the mask.
		 * @param {string} value - string masked value
		 * @param {string} mask - points.inputMask
		 * @returns {number} - count of points
		 */
		stringToPoints: React.PropTypes.func.isRequired,
		/**
		 * Validation string value according to 'distance' or 'time' type
		 * @param {string} value - value to validation
		 * @param {string} mask - points.inputMask
		 * @returns {boolean/string} - false or error message
		 */
		validation: 	React.PropTypes.func.isRequired
	},
	getInitialState:function(){
		return {
			error:false,
			stringValue:this.props.value //string value from component MaskedInput
		};
	},
	onChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	onBlur:function(e){
		const 	value = e.target.value,
				error = this.state.error;

		this.setState({
			stringValue: value === this.emptyMask ? 0 : value, // if empty value for current mask, then 0, else value
			error: error
		});

		e.stopPropagation();
	},
	onFocus:function(e){
		const 	value = this.state.stringValue,
				error = this.state.error;

		this.setState({
			stringValue: value === 0 ? this.emptyMask : value, // if value===0, then empty value for current mask, else value
			error: error
		});

		e.stopPropagation();
	},
	changeScore:function(strValue){
		const 	validationResult = this.props.validation(strValue, this.props.mask),
				points = validationResult ? this.props.value : this.props.stringToPoints(strValue, this.props.mask);

		this.setState({
			stringValue: strValue,
			error: validationResult
		});

		// save changes to events
		this.props.onChange({
								value: points,
								isValid:!validationResult
							});
	},
	/**
	 * get mask for MaskedInput component
	 * it is counted only once.
	 * */
	getMask:function(){
		const mask = this.props.mask;

		if(this.mask !== mask){
			this.mask = mask;
			this.defaultMask = mask.replace(/[hkmsc]/g, '9'); 	// mask in format '999:999:999'
			this.emptyMask = mask.replace(/[hkmsc]/g, '_');		// empty value for current mask
		}
		return this.defaultMask;
	},
	render:function(){
		const 	error 	= !!this.state.error,
				title 	= error ? this.state.error : null,
				value 	= this.state.stringValue,
				mask 	= this.getMask(),
				classes = classNames({
					bScore: true,
					mError: error
				});

		return (
			<div className={classes}>
				<MaskedInput title={title} value={value} className={`eScore_Points ${this.props.className}`} mask={mask}
							 onChange={this.onChange}
							 onBlur={this.onBlur}
							 onFocus={this.onFocus} />
			</div>
		);

	}
});


module.exports = MaskedPoints;
