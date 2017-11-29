const CSVExportConsts = require('module/ui/grid/csv_export/consts');
const UserModel = require('module/data/UserModel');

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