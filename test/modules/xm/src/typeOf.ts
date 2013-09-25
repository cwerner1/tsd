///<reference path="../../../globals.ts" />
///<reference path="../../../../src/xm/typeOf.ts" />

describe('xm.typeOf', () => {
	'use strict';

	var func = function () {
		//dummy
	};

	var data = (function () {
		return {
			arguments: [xm.isArguments, arguments],
			array: [xm.isArray, []],
			date: [xm.isDate, new Date()],
			function: [xm.isFunction, func],
			number: [xm.isNumber, 123],
			regexp: [xm.isRegExp, /abc/],
			string: [xm.isString, 'abc'],
			null: [xm.isNull, null],
			undefined: [xm.isUndefined, undefined],
			object: [xm.isObject, {}],
			boolean: [xm.isBoolean, true]
		};
	})();

	describe('typeOf()', () => {
		for (var mainType in data) {
			if (data.hasOwnProperty(mainType)) {

				it(mainType, () => {
					for (var checkType in data) {
						if (data.hasOwnProperty(checkType)) {
							var checkData = data[checkType];
							if (checkType === mainType) {
								assert.strictEqual(xm.typeOf(checkData[1]), mainType);
							}
							else {
								assert.notStrictEqual(xm.typeOf(checkData[1]), mainType);
							}
						}
					}
				});
			}
		}
	});

	describe('is<type>()', () => {
		for (var mainType in data) {
			if (data.hasOwnProperty(mainType)) {
				var mainData = data[mainType];

				it(mainType, () => {
					var func = mainData[0];
					for (var checkType in data) {
						if (data.hasOwnProperty(checkType)) {
							var checkData = data[checkType];
							if (checkType === mainType) {
								assert.isTrue(func(checkData[1]), 'testing ' + checkType);
							}
							else {
								assert.isFalse(func(checkData[1]), 'testing ' + checkType);
							}
						}
					}
				});
			}
		}
	});

	describe('isType() by name', () => {
		for (var mainType in data) {
			if (data.hasOwnProperty(mainType)) {

				it(mainType, () => {
					for (var checkType in data) {
						if (data.hasOwnProperty(checkType)) {
							var checkData = data[checkType];
							if (checkType === mainType) {
								assert.isTrue(xm.isType(checkData[1], mainType), 'testing ' + checkType);
							}
							else {
								assert.isFalse(xm.isType(checkData[1], mainType), 'testing ' + checkType);
							}
						}
					}
				});
			}
		}
	});
});
