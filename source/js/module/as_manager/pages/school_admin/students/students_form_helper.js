const StudentsFormHelper = {
	DEF_COUNT_NEXT_KIN_BLOCK: 1,
	MAX_COUNT_NEXT_KIN_BLOCK: 5,
	nextOfKinFields: [
		'relationship',
		'firstName',
		'lastName',
		'phones',
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
	convertNextOfKinToClientFormat: function(data){
		this.initEmptyNextOfKin(data);

		data.nextOfKin.forEach((nextOfKinItem, index) => {
			for(let key in nextOfKinItem){
				const value = nextOfKinItem[key];
				if(typeof value !== 'undefined') {
					if(key === 'phones') {
						value.forEach((phone, phoneIndex) => {
							data[`nok_${index}_phone_${phoneIndex}`] = phone;
						});
					} else {
						data[`nok_${index}_${key}`] = value;
					}
				}
			}
		});
	},
	convertNextOfKinToServerFormat: function(countNextOfKinBlocks, data){
		const nok = [];

		for(let index = 0; index < countNextOfKinBlocks; index++) {
			const emptyNextOfKin = {};

			// iterate next of kin fields for current index
			// data fields looks like:
			// nok_0_relationship
			// ...
			// nok_0_email
			// ...
			// nok_N_relationship
			// ...
			// nok_N_email
			// N = MAX_COUNT_NEXT_KIN_BLOCK
			this.nextOfKinFields.forEach(field => {
				switch (field) {
					case 'phones': {
						// collect phone_0, phone_1, ..., phone_n
						emptyNextOfKin.phones = [];
						let count = 0;
						while(typeof data[`nok_${index}_phone_${count}`] !== 'undefined') {
							emptyNextOfKin.phones.push(data[`nok_${index}_phone_${count}`]);
							data[`nok_${index}_phone_${count}`] = undefined;
							count++;
						}
						break;
					}
					default: {
						const value = data[`nok_${index}_${field}`];

						if(typeof value !== 'undefined' && value !== '') {
							emptyNextOfKin[field] = value;
							// it's a little trick - delete old form data
							// because this should not be in post data
							data[`nok_${index}_${field}`] = undefined;
						}
						break;
					}
				}
			});

			if(Object.keys(emptyNextOfKin).length > 0) {
				nok.push(emptyNextOfKin);
			}
		}

		data.nextOfKin = nok;
	},
	getInitValueNextOfKinCount: function(student) {
		const count = student.nextOfKin.length;

		return count === 0 ? this.DEF_COUNT_NEXT_KIN_BLOCK : count;
	}
};

module.exports = StudentsFormHelper;