///<reference path="../../../_ref.ts" />
///<reference path="../../../tsdHelper.ts" />
///<reference path="../../../../src/tsd/API.ts" />
///<reference path="../../../../src/tsd/select/Selector.ts" />
///<reference path="../../../../src/xm/io/hash.ts" />

describe('API', () => {

	var fs = require('fs');
	var path = require('path');
	var FS:Qfs = require('q-io/fs');

	var api:tsd.API;
	var context:tsd.Context;

	before(() => {
		//copy temp for saving
	});
	beforeEach(() => {
		context = helper.getContext();
		context.log.mute = true;
		context.config.log.mute = true;
	});
	afterEach(() => {
		context = null;
		api = null;
	});

	it('should be defined', () => {
		assert.isFunction(tsd.API, 'constructor');
	});
	it('should throw on bad params', () => {
		assert.throws(() => {
			api = new tsd.API(null);
		});
	});
	it('should be constructor', () => {
		api = new tsd.API(context);
		assert.isObject(api, 'constructor');

		//api.gitAPI.debug = true;
	});

	function applyMute(mute:bool) {
		api.core.log.mute = mute;
		api.context.log.mute = mute;
		api.context.config.log.mute = mute;
	}

	function applyTempInfo(label:string, index:number, data:any, selector:tsd.Selector):helper.TempInfo {
		var tmp = helper.getTempInfo(label, index, true);
		api.context.paths.configFile = tmp.configFile;
		api.context.config.typingsPath = tmp.typingsDir;

		xm.FileUtil.writeJSONSync(tmp.selectorDumpFile, selector);
		xm.FileUtil.writeJSONSync(tmp.dataCopyFile, data);

		applyMute(!data.debug);

		return tmp;
	}

	describe('search', () => {
		var select = require(path.resolve(__dirname, '../fixtures/select'));
		var i = 0;
		select.forEach((data) => {
			var selector = new tsd.Selector(data.selector.pattern);

			it('selector "' + String(selector) + '"', (done) => {
				api = new tsd.API(context);

				var tmp = applyTempInfo('search', (i++), api, data, selector);

				api.search(selector).then((result:tsd.APIResult) => {
					helper.assertAPIResult(result, data.result, 'result');

					done();
				}).done(null, done);
			});
		});
	});

	describe('install', () => {
		var select =  require(path.resolve(__dirname, '../fixtures/install'));
		var i = 0;
		select.forEach((data) => {
			var selector = new tsd.Selector(data.selector.pattern);

			it('selector "' + String(selector) + '"', (done) => {
				api = new tsd.API(context);

				var tmp = applyTempInfo('install', (i++), data, selector);

				api.install(selector).then((result:tsd.APIResult) => {
					helper.assertAPIResult(result, data.result, 'result');
					assert.isFile(api.context.paths.configFile);

					if (!data.config) {
						return null;
					}

					//set for correct comparison
					data.config.typingsPath = tmp.typingsDir;

					//read json as promise to voodoo-bugfix for weird "SyntaxError: Unexpected end of input" issue
					return xm.FileUtil.readJSONPromise(api.context.paths.configFile).then((json) => {
						assert.deepEqual(json, data.config, 'config');
					}).then(() => {
						return helper.listDefPaths(tmp.typingsDir);
					}).then((typings) => {
						helper.assertUnorderedStrict(typings, Object.keys(data.config.installed), 'installed file');
						typings.forEach((ref:string) => {
							assert.notIsEmptyFile(path.join(tmp.typingsDir, ref), 'typing');
						});
					});
				}).then(() => {
					done();
				}).done(null, done);
			});
		});
	});
});