///<reference path="../../tsdHelper.ts" />

module helper {
	'use strict';

	var assert = helper.assert;

	export function serialiseDefInfo(info:tsd.DefInfo, recursive:bool):any {
		xm.assertVar('info', info, tsd.DefInfo);

		var json:any = {};
		json.name = info.name;
		json.version = info.version;
		json.submodule = info.submodule;
		json.description = info.description;
		json.projectUrl = info.projectUrl;
		json.reposUrl = info.reposUrl;
		json.references = info.references.slice(0);
		json.authors = [];
		if (info.authors && recursive) {
			info.authors.forEach((author:xm.AuthorInfo) => {
				json.authors.push(serialiseAuthor(author));
			});
		}
		return json;
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	export function assertDefInfo(info:tsd.DefInfo, values:any, message:string) {
		assert.ok(info, message + ': info');
		assert.ok(values, message + ': values');
		assert.instanceOf(info, tsd.DefInfo, message + ': info');

		helper.propStrictEqual(info, values, 'name', message);
		if (values.version) {
			helper.propStrictEqual(info, values, 'version', message + ': info');
		}
		if (values.submodule) {
			helper.propStrictEqual(info, values, 'submodule', message + ': info');
		}
		if (values.description) {
			assert.strictEqual(info.description, values.description, message + ': info.description');
		}
		helper.propStrictEqual(info, values, 'projectUrl', message);
		helper.propStrictEqual(info, values, 'reposUrl', message);

		if (values.authors) {
			helper.assertUnorderedNaive(info.authors, values.authors, helper.assertAuthor, message + ': authors');
		}
		if (values.references) {
			helper.assertUnorderedNaive(info.authors, values.authors, assert.strictEqual, message + ': authors');
		}
	}

}