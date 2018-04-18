import * as StorageHelpers from "module/helpers/storage";

export const DefaultPageSettingsHelper = {
	getDefaultPageSettingsByRole(role: string) {
		let settings;
		const defaultPageSettings = StorageHelpers.LocalStorage.get('defaultPageSettings');

		if(typeof defaultPageSettings !== 'undefined') {
			settings = defaultPageSettings[role];
		}

		return settings;
	},
	setDefaultPageSettingsByRole(settings, role: string) {
		let defaultPageSettings = StorageHelpers.LocalStorage.get('defaultPageSettings');
		if(typeof defaultPageSettings === 'undefined') {
			defaultPageSettings = {};
		}

		defaultPageSettings[role] = settings;

		StorageHelpers.LocalStorage.set('defaultPageSettings', defaultPageSettings);
	}
};