const Consts = require('module/as_admin/pages/apps/const');

const Helper = {
	convertServerDataToClient: function (data) {
		data.platform = Consts.PLATFORM_SERVER_TO_CLIENT_MAP[data.platform];
	},
	convertClientDataToServer: function (data) {
		data.platform = Consts.PLATFORM_CLIENT_TO_SERVER_MAP[data.platform];
	}
};

module.exports = Helper;
