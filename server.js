
var http = require("http");
var url  = require("url");
var static = require("node-static");
var _ = require("underscore");
var io = require("socket.io");
var wsEvents = require("./socketEvents");

var file = new(static.Server)('./public');

function start(route, handle) {
	function onRequest(request, response) {
		var postData = "";
		var pathname = url.parse(request.url).pathname;

		var isStaticFile = /\.\w*$/g.test(pathname);

		if (isStaticFile) {
			request.addListener('end', function() {
				file.serve(request, response);
			});
		} else {
			console.log("Request received at "+ new Date().getTime()+" - "+pathname);
			route(pathname, handle, response, request);
		}
	}

	var httpServer = http.createServer(onRequest).listen(80);
	var ws = io.listen(httpServer, { log: false });

	var clients = [];

	wsEvents.init(ws, clients);

	console.log("=================================");
	console.log("Server started at localhost:80.");
}

exports.start = start;
