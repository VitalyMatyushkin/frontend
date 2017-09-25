const ClubsConst = require('module/helpers/consts/clubs');

const ClubsHeper = {
	convertClientToServerFormData: function(data, clubsFormPageData) {
		data.ages = clubsFormPageData.ages;
		data.price = {
			price: data.price,
			priceType: ClubsConst.CLIENT_TO_SERVER_PRICING_MAPPING[data.priceType]
		};

		delete data.priceType;

	}
};

module.exports = ClubsHeper;