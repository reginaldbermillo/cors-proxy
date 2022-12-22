const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
app.use(cors())
app.use(createProxyMiddleware({
  router: (req) => new URL(req.path.substring(1)),
  pathRewrite: (path, req) => (new URL(req.path.substring(1))).pathname,
  changeOrigin: true,
  logger: console
}))

const updateQueryStringParameter = (path, key, value) => {
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = path.indexOf('?') !== -1 ? '&' : '?';
  if (path.match(re)) {
    return path.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    return path + separator + key + '=' + value;
  }
};

const options = {
  changeOrigin: true,
  logger: console,
  router: (req) => new URL(req.path.substring(1)),
  pathRewrite: function(path, req) {
    let newPath = path;
    newPath = updateQueryStringParameter(newPath, 'mediaFormats',  'WAV');
    // newPath = updateQueryStringParameter(newPath, 'client_secret',  clientSecret);
    return newPath;
  },
};

app.use('/audio', proxy(options));

app.listen(process.env.PORT || 8088, () => {
  console.info('proxy server is running on port 8088')
})