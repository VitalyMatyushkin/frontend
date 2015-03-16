'use strict';
var InvitesMixin;

InvitesMixin = {
	getActiveSchoolId: function () {
		var self = this;

		return self.getMoreartyContext().getBinding().get('activeSchoolId');
	},
	getFilteredInvites: function (filterId, direction, order, upperNew) {
		direction = direction || 'inbox';
		order = order || 'ask';

		var self = this,
			binding = self.getDefaultBinding(),
			modelsBinding = binding.sub('models'),
			filtered = modelsBinding.get().filter(function (model) {
				return direction === 'inbox' ? model.get('invitedId') === filterId :  model.get('inviterId') === filterId;
			}),
			result = filtered;

		result = filtered.sort(function (m1, m2) {
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

		if (upperNew) {
			result = filtered.sort(function (m1, m2) {
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
	}
};

module.exports = InvitesMixin;