import * as BPromise from 'bluebird';

export class PromiseHelper {
	promiseFor: any;

	constructor() {
		this.promiseFor = BPromise.method((condition, action, value) => {
			if (!condition(value)) {
				return value;
			}

			return action(value).then(value => {
				return this.promiseFor(condition, action, value);
			});
		});
	}
}