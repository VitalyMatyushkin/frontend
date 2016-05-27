/**
 * Created by Anatoly on 26.05.2016.
 */

const 	React 			= require('react'),
		Immutable 		= require('immutable'),
		NextOfKinFields = require('./next_of_kin_fields');

const NextOfKin = React.createClass({
	mixins: [Morearty.Mixin],
	//getDefaultState:function(){
	//	return Immutable.Map({
	//		showForm: true
	//	});
	//},
	renderFileds:function(item, i){
		const self = this,
			binding = self.getDefaultBinding();
		return (
			<div>
				<NextOfKinFields binding={binding.sub(`${i}`)} />
				<span className="button" onClick={self.onDelete.bind(null, i)} >Delete</span>
			</div>
		);
	},
	onDelete:function(i){
		console.log('onDelete not implemented');
	},
	onAdd:function(e){
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				data 	= binding.toJS(),
				newItem = {
					relationship:   '',
					firstName:      '',
					lastName:       '',
					phone:          '',
					email:          ''
				};

		if(data && data.length < 2){
			data.push(newItem);
			binding.set(Immutable.fromJS(data));
		}

		e.stopPropagation();
	},
	render: function() {
		const self = this,
			binding = self.getDefaultBinding(),
			data = binding.toJS();

		return (
			<div className="bNextOfKin">
				<h2>Next Of Kin <span className="eAdd" onClick={self.onAdd}>+</span></h2>
				<div>
					{data && data.map(self.renderFileds)}
				</div>
			</div>
		);
	}
});



module.exports = NextOfKin;