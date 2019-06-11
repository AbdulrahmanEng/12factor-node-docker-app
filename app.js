require('dotenv').config();
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
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

const host = process.env.IP || 'localhost';
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running at ${host}:${port}`));
