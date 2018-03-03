/**
 * Created by wert on 02.03.2018
 */

import {expect} from 'chai';

import {DateHelper} from "../../../source/js/module/helpers/date_helper";


describe('DateHelper', () => {
	describe('isValidDateTime', () => {
		it('should return true for dates in format "YYYY-MM-DD HH:mm"', () => {
			// this test inspired by bug in safari
			const result = DateHelper.isValidDateTime('2010-01-01 09:00');
			expect(result).to.be.true;
		});

		it('should return false for not-date but in correct format: "2017-01-01 __:__"', () => {
			// this test inspired by bug in safari
			const result = DateHelper.isValidDateTime('2010-01-01 __:__');
			expect(result).to.be.false;
		});
	});
});