

export class DataPrototype {
	data: any = {};
	bindObject: any;
	/**
	 * Getting initial state of data
	 * @returns {*}
	 */
	getDefaultState() {
		return this.data;
	}

	/**
	 * Binding to morearty context
	 * @param bindObject
	 */
	setBinding(bindObject) {

		this.bindObject = bindObject;
		this.initBind && this.initBind();
	}

	/**
	 * Define this method in data class
	 */
	initBind() {}
}