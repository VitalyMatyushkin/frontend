import * as Promise from 'bluebird';

export class PromiseHelper {
	promiseFor: any;

	constructor() {
		this.promiseFor = Promise.method((condition, action, value) => {
			if (!condition(value)) {
				return value;
			}

			return action(value).then(value => {
				return this.promiseFor(condition, action, value);
			});
		});
	}
}