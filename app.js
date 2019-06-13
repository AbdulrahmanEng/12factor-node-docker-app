require('dotenv').config();

const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const serveIndex = require('serve-index');
const proxy = require('express-http-proxy');

const serverName = process.env.SERVER_NAME || 'default';
const baseImageUrl = process.env.BASE_IMAGE_URL;
const proxyBaseImageUrl = baseImageUrl
	? proxy(baseImageUrl, {
		proxyReqPathResolver: function(req) {
			const newPath = baseImageUrl + req.path;
			console.log(newPath);
			return newPath;
		}
	})
	:express.static(path.join(__dirname,'public/images'));

const app = express();

app.use('/images', proxyBaseImageUrl);
app.use(fileUpload({
	limits: { fileSize: 1 * 1024 * 1024 },
}));

const uploadDirname = path.join(__dirname, 'public/uploads');
app.use('/uploads', express.static(uploadDirname), serveIndex(uploadDirname, {'icons': true}));

app.get('/', function(req, res) {
	res.send(`
		<h1>${serverName}</h1>
		<p><img src="/images/trees.jpeg" width="200" /></p>
		<form action="/upload" enctype="multipart/form-data" method="post">
			<input type="file" name="file" /><br/><br/>
			<input type="submit" value="Upload"/>
		</form>
		`);
});

app.post('/upload', function(req, res) {
	if(!req.files) {
		return res.status(400).send('No files were uploaded!');
	}

	const { file } = req.files;
	const uploadTo = `/uploads/${file.name}`;

	console.log(`Uploading ${file.name}...`);
	
	file.mv(__dirname + '/public' + uploadTo, err => {
		if(err) {
			return res.status(500).send(err);
		}
		res.send(`
			<h1>${serverName}</h1>
			<p>File uploaded to <a href="${uploadTo}"/>${uploadTo}</a></p>
			<p><img src="${uploadTo}" width="200" /></p>
			`);
	});
});

const host = process.env.IP || 'localhost';
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running at ${host}:${port}`));
