const 	React 	= require('react'),
		Button 	= require('module/ui/button/button');

const ExportStudentsStyles = require('styles/pages/export_students/b_export_students.scss');

const ExportStudents = React.createClass({
	propTypes: {
		schoolId: React.PropTypes.string.isRequired
	},
	onClick(){
		const schoolId = this.props.schoolId;
		
		window.Server.exportStudents.get({schoolId}).then(
			//https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
			//we save response from server in csv file
			//because the only way to add HTTP headers is using the XHR, but XHR cannot be used to download files.
			response => {
				/*global Blob:true*/
				const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
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
			},
			error => {
				console.error(error.xhr.responseText);
			}
		);
	},
	render: function(){
		return (
			<div className="bExportStudents">
				<Button
					text 		= "Export students to CSV"
					onClick  	= { this.onClick }
				/>
			</div>
		);
	}
});

module.exports = ExportStudents;