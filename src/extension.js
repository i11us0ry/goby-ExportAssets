function activate(content) {	
	goby.registerCommand('ExportUrls', function () {
		let path = __dirname + "/index.html"
		goby.showIframeDia(path, "Export Assets", "320", "150");
	});
}

exports.activate = activate;