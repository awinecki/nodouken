
function route(pathname, handle, response, request) {
	console.log("Routing request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else {
		console.log("No req handler found for " + pathname);
		response.writeHead(404, {"content-Type": "text/plain"});
		response.write("404 Not found.");
		response.end();
	}
}

exports.route = route;
