const TypeMixin = require('module/ui/form/types/type_mixin'),
	React = require('react'),
    Immutable 	= require('immutable'),

TypePhone =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
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
	_forceNewValue: function(value) {
        const self = this,
            binding = self.getDefaultBinding();
        let cc = '+44',
            phone;

        if(!value)
            return;

        if(value.indexOf('0') === 0)
            value = value.replace('0', '');

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
        const res = phone.replace(/[^+#\d]/g, '');
        return res;
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

        binding.set('phone', inputValue);
        self.saveValue();
    },
	render: function () {
		const self = this,
            binding = self.getDefaultBinding(),
            cc = binding.get('cc'),
            phone = binding.get('phone');

		return (
			<div className="eForm_fieldInput mPhone">
                <select onChange={self.ccChange} value={cc} >
                    <option value="+44" >+44</option>
                    <option value="+7" >+7</option>
                </select>
                <input type="text" value={phone} onChange={self.phoneChange} />
			</div>
		)
	}
});


module.exports = TypePhone;