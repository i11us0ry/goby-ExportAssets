function activate(content) {	
	goby.registerCommand('ExportAssets', function () {
		let path = __dirname + "/index.html"
		goby.showIframeDia(path, "Export Assets", "320", "150");
	});
}

exports.activate = activate;