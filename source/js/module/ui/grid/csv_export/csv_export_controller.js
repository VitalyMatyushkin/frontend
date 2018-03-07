const CSVExportConsts = require('module/ui/grid/csv_export/consts');
const UserModel = require('module/data/UserModel');
const Timezone = require('moment-timezone');
const converter = require('json-2-csv');

const CSVExportController = {
	getCSVByGridModel: function (gridType, data, model) {
		const csvData = data.map(item => {
			let data = {};

			switch (gridType) {
				case CSVExportConsts.gridTypes.SUPERADMIN_USERS: {
					const userModel = new UserModel(item);
					data = this.getCSVItemForSuperadminUsers(userModel, model);
					break;
				}
				case CSVExportConsts.gridTypes.SUPERADMIN_STATISTIC: {
					data = this.getCSVItemForSuperadminStatistic(item, model);
					break;
				}
			}

			return data;
		});

		this.convertToCSV(csvData);
	},
	/**
	 * Function returns csv item by data item from grid for SUPERADMIN_USERS grid type
	 * @param model
	 * @param item
	 * @returns {{}}
	 */
	getCSVItemForSuperadminUsers: function (userModel, model) {
		const csvItem = {};

		model.table.columns.forEach(column => {
			const dataField = column.cell.dataField;

			switch (dataField) {
				case 'roles': {
					csvItem.roles = userModel.roleArray.join(';');
					break;
				}
				case 'school': {
					csvItem.schools = userModel.schoolArray.join(';');
					break;
				}
				default: {
					if(typeof column.cell.dataField !== 'undefined') {
						const value = userModel[column.cell.dataField];

						csvItem[column.cell.dataField] = typeof value !== 'undefined' && value !== null ? value : '';
					}
					break;
				}
			}
		});

		return csvItem;
	},
	getCSVItemForSuperadminStatistic: function (item, model) {
		const csvItem = {};
		model.table.columns.forEach(column => {
			const dataField = column.cell.dataField;
			switch (dataField) {
				case 'firstHit': {
					csvItem.firstHit = item.firstHit ? Timezone.tz(item.firstHit, window.timezone).format('DD.MM.YY hh:mm:ss') : '';
					break;
				}
				case 'lastHit': {
					csvItem.lastHit = item.firstHit ? Timezone.tz(item.lastHit, window.timezone).format('DD.MM.YY hh:mm:ss') : '';
					break;
				}
				case 'user.firstName': {
					csvItem.firstName = item.user.firstName ? item.user.firstName : '';
					break;
				}
				case 'user.lastName': {
					csvItem.lastName = item.user.lastName ? item.user.lastName : '';
					break;
				}
				case 'user.email': {
					csvItem.email = item.user.email ?  item.user.email : '';
					break;
				}
				case 'user.permissionList': {
					csvItem.permissionList = item.user.permissionList ? item.user.permissionList.join('; ') : '';
					break;
				}
				default: {
					if(typeof column.cell.dataField !== 'undefined') {
						const value = item[column.cell.dataField];
						csvItem[column.cell.dataField] = typeof value !== 'undefined' && value !== null ? value : '';
					}
					break;
				}
			}

		});
		
		return csvItem;
	},
	convertToCSV: function (data) {
		converter.json2csv(data, (err, csv) => {
			if (err) throw err;

			/*global Blob:true*/
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
			if (window.navigator.msSaveBlob) { // IE 10+
				window.navigator.msSaveBlob(blob, 'file.csv');
			} else {
				const link = document.createElement("a");
				if (link.download !== undefined) { // feature detection
					// Browsers that support HTML5 download attribute
					/*global URL:true*/
					const url = URL.createObjectURL(blob);
					link.setAttribute("href", url);
					link.setAttribute("download", 'file.csv');
					link.style.visibility = 'hidden';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			}
		});
	}
};

module.exports = CSVExportController;