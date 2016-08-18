/**
 * Created by Bright on 01/03/2016.
 */
const   React       = require('react'),
        Immutable   = require('immutable'),
        Morearty    = require('morearty'),
        Form        = require('module/ui/form/form'),
        FormColumn 	= require('module/ui/form/form_column'),
        FormField   = require('module/ui/form/form_field');

const TabItemDetails = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            userId = binding.get('userWithPermissionDetail.id'),
            schoolId = globalBinding.get('userRules.activeSchoolId');

        self.params = {schoolId:schoolId, userId:userId};

        window.Server.user.get(self.params).then(function (data) {
            binding.set('form',Immutable.fromJS(data));
            return data;
        });
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.clear('form');
    },
    _onSubmit:function(data){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.user.put(self.params,data).then(function(user){
            binding.set('popup',false);
            return user;
        });
    },
    getPhone: function(phone) {
        // return '7' + phone.replace('(', '').replace(')', '').replace('-', '');
        return phone.replace(' ', '').replace('(', '').replace(')', '').replace('-', '');
    },
	getGender: function () {
		const gendersArray = [
			{
				value: 'Male',
				id: 'MALE'
			},
			{
				value: 'Female',
				id: 'FEMALE'
			}
		];

		return Promise.resolve(gendersArray);
	},
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="bDetails">
                <Form binding={binding.sub('form')} service="superadmin/users" onSubmit={self._onSubmit} defaultButton="Save" formStyleClass="mDetails">
                    <FormColumn>
                        <FormField labelText="Upload New Avatar" type="imageFile" typeOfFile="image" field="avatar"/>
                    </FormColumn>
                    <FormColumn>
                        <FormField type="text" field="firstName" validation="required">First name</FormField>
                        <FormField type="text" field="lastName" validation="required">Surname</FormField>
						<FormField type="radio" field="gender" sourcePromise={self.getGender}>Gender</FormField>
                        <FormField type="text" field="email" validation="email server">Email</FormField>
                        <FormField type="phone" field="phone" validation="server" onPrePost={self.getPhone}>Mobile phone</FormField>
                        <FormField type="dropdown" field="status" userActiveState="Active" userProvidedOptions={['Active','Blocked']}>Status</FormField>
                    </FormColumn>
                </Form>
            </div>
        );
    }
});
module.exports = TabItemDetails;