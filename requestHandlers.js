
var querystring = require("querystring"),
    exec        = require("child_process").exec,
    fs          = require("fs"),
    formidable  = require("formidable"),
		jade				= require("jade");

function render(tmpl, locals, response, request) {
	jade.renderFile(tmpl, locals, function(err, data) {
		if (err) console.log(err);
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(data);
		response.end();
	});
}

function start(response, request) {
	render('./templates/index.jade', {}, response, request);
}

function upload(response, request) {
	var form = new formidable.IncomingForm({
		uploadDir: 'C:/wamp/www/node/tmp',
		keepExtensions: true
	});
	console.log("about to parse");
	form.parse(request, function(err, fields, files) {
		console.log(form);
		console.log(files.img);

		fs.rename(files.img.path, "./tmp/test.png", function(err) {
			if (err) {
				fs.unlinkSync("./tmp/test.png");
				fs.rename(files.img.path, "./tmp/test.png");
			}
		});

		response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
	});
}

function show(response, request) {
	fs.readFile("./tmp/test.png", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
	});
}

function sockets(response, request) {
	render('./templates/sockets.jade', {}, response, request);
}

exports.start  = start;
exports.upload = upload;
exports.show = show;
exports.sockets = sockets;

