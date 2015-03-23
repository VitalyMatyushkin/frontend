'use strict';
var InvitesMixin;

InvitesMixin = {
	getActiveSchoolId: function () {
		var self = this;

		return self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
	},
    getDateWithTime: function (invite) {
        var date = new Date(invite.get('meta.updated'))
    },
	getFilteredInvites: function (filterId, direction, order, upperNew) {
		direction = direction || 'inbox';
		order = order || 'ask';

		var self = this,
			binding = self.getDefaultBinding(),
			modelsBinding = binding.sub('models'),
            result = modelsBinding.get().filter(function (model) {
				return direction === 'inbox' ?
                model.get('invitedId') === filterId && !model.get('repaid') :
                model.get('inviterId') === filterId && !model.get('repaid');
			});

		if (direction) {
            result = result.sort(function (m1, m2) {
                var firstModelDate = Date.parse(m1.get('meta.updated')),
                    secondModelDate = Date.parse(m2.get('meta.updated')),
                    compareResult = 0;

                if (firstModelDate > secondModelDate) {
                    compareResult = order === 'ask' ? 1 : -1;
                } else if (firstModelDate < secondModelDate) {
                    compareResult = order === 'ask' ? -1 : 1
                }

                return compareResult;
            });
        }


		if (upperNew) {
			result = result.sort(function (m1, m2) {
				var isRepaidM1 = m1.get('repaid'),
					isRepaidM2 = m2.get('repaid'),
					compareResult = 0;

				if (isRepaidM1 && !isRepaidM2) {
					compareResult = 1;
				} else if (!isRepaidM1 && isRepaidM2) {
					compareResult = -1;
				}

				return compareResult;
			});
		}

		return result;
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
		return new Date(string).toLocaleDateString('en-BG', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).replace(/\./g, '/');
	}
};

module.exports = InvitesMixin;