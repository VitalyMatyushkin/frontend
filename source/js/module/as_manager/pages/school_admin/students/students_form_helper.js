const StudentsFormHelper = {
	DEF_COUNT_NEXT_KIN_BLOCK: 1,
	MAX_COUNT_NEXT_KIN_BLOCK: 5,
	nextOfKinFields: [
		'relationship',
		'firstName',
		'lastName',
		'phone',
		'email'
	],
	/**
	 * NOTE! Function modifies arg.
	 * Just insert to arg data empty next of kin fields for student form
	 * @param data
	 */
	initEmptyNextOfKin: function(data) {
		for(let index = 0; index < this.MAX_COUNT_NEXT_KIN_BLOCK; index++) {
			this.nextOfKinFields.forEach(field => data[`nok_${index}_${field}`]);
		}
	},
	/**
	 * NOTE! Function modifies arg.
	 * Copy next of kin data(server side format) to form next of kin data(client side format).
	 * @param data
	 */
	convertNextOfKinToClientFormat:function(data){
		this.initEmptyNextOfKin(data);

		data.nextOfKin.forEach((nextOfKinItem, index) => {
			for(let key in nextOfKinItem){
				const value = nextOfKinItem[key];
				if(typeof value !== 'undefined') {
					data[`nok_${index}_${key}`] = value;
				}
			}
		});
	},
	convertNextOfKinToServerFormat: function(countNextOfKinBlocks, data){
		const nok = [];
		for(let index = 0; index < countNextOfKinBlocks; index++) {
			nok.push({
				relationship:	'',
				firstName:		'',
				lastName:		'',
				phone:			'',
				email:			''
			});

			for(let key in nok[index]){
				const value = data[`nok_${index}_${key}`];
				if(typeof value !== 'undefined') {
					nok[index][key] = value;
					// it's a little trick - delete old form data
					// because this should not be in post data
					data[`nok_${index}_${key}`] = undefined;
				}
			}
		}

		data.nextOfKin = nok;
	},
	getInitValueNextOfKinCount: function(student) {
		const count = student.nextOfKin.length;

		return typeof count != 0 ? count : 1;
	}
};

module.exports = StudentsFormHelper;