'use strict';
const   {DateHelper} = require('module/helpers/date_helper'),

InvitesMixin = {
	getActiveSchoolId: function () {
		var self = this;

		return self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
	},
    getDateWithTime: function (invite) {
        var date = new Date(invite.get('meta.updated'))
    },
	
    findParticipant: function (id) {
        var self = this,
            binding = self.getDefaultBinding(),
            participant = binding.get('participants').find(function (model) {
                return model.get('id') === id;
            });

        return participant;
    },
    findIndexParticipant: function (id) {
        var self = this,
            binding = self.getDefaultBinding(),
            participantIndex = binding.get('participants').findIndex(function (model) {
                return model.get('id') === id;
            });

        return participantIndex;
    },
    zeroFill: function (i) {
        return (i < 10 ? '0' : '') + i;
    },
	formatDate: function (string) {
		return DateHelper.getDate(string);
	}
};

module.exports = InvitesMixin;