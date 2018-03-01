/**
 * Created by Bright on 01/03/2016.
 */
const   React       	= require('react'),
        Immutable   	= require('immutable'),
        Morearty    	= require('morearty'),
		Promise 		= require('bluebird'),
        Form        	= require('module/ui/form/form'),
        FormColumn 		= require('module/ui/form/form_column'),
        FormField   	= require('module/ui/form/form_field'),

		DetailsStyle	= require('../../../../styles/ui/popup/b_details.scss');

const USER = require('module/helpers/consts/user');

const TabItemDetails = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        onCancel: React.PropTypes.func.isRequired
    },
    componentWillMount:function(){
        const   binding = this.getDefaultBinding(),
	            globalBinding = this.getMoreartyContext().getBinding(),
	            userId = binding.get('userWithPermissionDetail.id'),
	            schoolId = globalBinding.get('userRules.activeSchoolId');

	    this.params = {schoolId:schoolId, userId:userId};

        window.Server.user.get(this.params).then(function (data) {
            binding.set('form',Immutable.fromJS(data));
            return data;
        });
    },
    componentWillUnmount:function(){
        const binding = this.getDefaultBinding();
        binding.clear('form');
    },
    _onSubmit:function(data){
        const binding = this.getDefaultBinding();

	    data.countOneTimeIosSessions = data.countOneTimeIosSessions ? Number(data.countOneTimeIosSessions) : undefined;
	    data.countOneTimeAndroidSessions = data.countOneTimeAndroidSessions ? Number(data.countOneTimeAndroidSessions) : undefined;
	    data.countOneTimeWebSessions = data.countOneTimeWebSessions ? Number(data.countOneTimeWebSessions) : undefined;

		const promises = [];

		// update verification fields by separate methods if these were changed
		const oldData = binding.sub('form').toJS();
		if(oldData.verification.status.email !== data.verification.status.email) {
			promises.push(
				window.Server.usersForceEmailVefication.put(this.params, {status: data.verification.status.email})
			);
		}
		if(oldData.verification.status.sms !== data.verification.status.sms) {
			promises.push(
				window.Server.usersForcePhoneVefication.put(this.params, {status: data.verification.status.sms})
			);
		}

		promises.push(
			window.Server.user.put(this.params,data)
				.then(user => {
					binding.set('popup',false);
					return user;
				})
		);

		return Promise.all(promises);
    },
    getPhone: function(phone) {
        // return '7' + phone.replace('(', '').replace(')', '').replace('-', '');
        return phone.replace(' ', '').replace('(', '').replace(')', '').replace('-', '');
    },
    getGender: function () {
        const gendersArray = [
            {
                text: 'Male',
                value: USER.GENDER.MALE
            },
            {
                text: 'Female',
                value: USER.GENDER.FEMALE
            },
            {
                text: 'Not defined',
                value: USER.GENDER.NOT_DEFINED
            }
        ];
        return gendersArray;
    },
    render:function(){
        const binding = this.getDefaultBinding();

        return (
            <div className="bDetailsTab">
                <Form binding       = {binding.sub('form')}
                      service       = "superadmin/users"
                      onSubmit      = {this._onSubmit}
                      onCancel      = {this.props.onCancel}
                      defaultButton = "Save"
                      formStyleClass= "mDetails"
                >
                    <FormColumn>
                        <FormField labelText="Upload New Avatar" type="imageFile" typeOfFile="image" field="avatar"/>
                    </FormColumn>
                    <FormColumn>
                        <FormField type="text" field="firstName" validation="required">First name</FormField>
                        <FormField type="text" field="lastName" validation="required">Surname</FormField>
						<FormField type="dropdown" field="gender" options={this.getGender()}>Gender</FormField>
                        <FormField type="text" field="email" validation="email server">Email</FormField>
                        <FormField type="phone" field="phone" validation="server" onPrePost={this.getPhone}>Mobile phone</FormField>
						<FormField type="checkbox" field="verification.status.email">Email verified</FormField>
						<FormField type="checkbox" field="verification.status.sms">Phone verified</FormField>
	                    <FormField type="number" field="countOneTimeIosSessions">Count one time iOS sessions</FormField>
	                    <FormField type="number" field="countOneTimeAndroidSessions">Count one time Android sessions</FormField>
	                    <FormField type="number" field="countOneTimeWebSessions">Count one time Web sessions</FormField>
                    </FormColumn>
                </Form>
            </div>
        );
    }
});
module.exports = TabItemDetails;