const   TypeMixin   = require('module/ui/form/types/type_mixin'),
	    React       = require('react'),
        Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
		helper		= require('module/helpers/loader_utils');

const TypePhone =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
    propTypes: {
        id: React.PropTypes.string
    },
    getDefaultState: function() {
        return Immutable.fromJS({
            phone:'',       //input value
            cc:'+44',       //country code
            value:'',       //final value
            defaultValue:'' //initial value
        });
    },
    componentWillMount: function() {
        const self = this,
            binding = self.getDefaultBinding();

        self._forceNewValue(binding.get('defaultValue'));
        self.addBindingListener(binding, 'defaultValue', changes => self._forceNewValue(changes.getCurrentValue()));
        self.addBindingListener(binding, 'value', changes => self.setValue(self.clearPhone(changes.getCurrentValue())));
    },
	componentDidUpdate: function () {
		if(this.cursor >= 0){
			this.refs.input.setSelectionRange(this.cursor,this.cursor);
		}
	},
	_forceNewValue: function(value) {
        const self = this,
            binding = self.getDefaultBinding();
        let cc = '+44',
            phone;

        if(!value)
            return;

        if(value.indexOf('+7') === 0)
            cc = '+7';

        phone = value.replace(cc, '');
        binding.atomically()
            .set('cc', cc)
            .set('phone', phone)
            .commit();

        self.saveValue();
	},
    saveValue:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            cc = binding.get('cc'),
            phone = self.clearPhone(binding.get('phone'));

        self.setValue(cc + phone);
    },
    clearPhone:function(phone){
		/** remove 0 before phone number */
		if(phone && phone.indexOf('+440') === 0)
			phone = phone.replace('+440', '+44');

		//Stops error being thrown when phone is null and replace method is being invoked
        return phone ? phone.replace(/[^+#\d]/g, ''):'';
    },
    ccChange: function(e) {
        const self = this,
            binding = self.getDefaultBinding(),
            inputValue = e.target.value;

        binding.set('cc', inputValue);
        self.saveValue();
    },
    phoneChange: function(e) {
        const self = this,
            binding = self.getDefaultBinding(),
            inputValue = e.target.value;

		this.cursor = e.target.selectionStart;
        binding.set('phone', inputValue);
        self.saveValue();
    },
	handleBlur: function(e) {
		this.cursor = -1;
	},
	getAvailableCodes:function(){
		const codes = ["+44"];

		if(helper.isDeveloperEnvironment(window.location.hostname)){
			codes.push("+7");
		}

		return codes;
	},
	render: function () {
		const self = this,
            binding = self.getDefaultBinding(),
            cc = binding.get('cc'),
            phone = binding.get('phone'),
			codes = self.getAvailableCodes();

		return (
			<div className="eForm_fieldInput mPhone">
                <select id="select_phone_prefix" onChange={self.ccChange} value={cc} disabled={!!this.props.isDisabled} >
					{codes.map(code => <option key={code} value={code} >{code}</option>)}
                </select>
                <input ref="input" type="text" id={self.props.id} value={phone} onChange={self.phoneChange} onBlur={self.handleBlur} disabled={!!this.props.isDisabled} />
			</div>
		)
	}
});


module.exports = TypePhone;