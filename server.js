const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
app.use(cors())
app.use(createProxyMiddleware({
  router: (req) => new URL(req.path.substring(1)),
  pathRewrite: function(path, req) {
    let newPath = new URL(req.path.substring(1)).pathname;
    let mediaFormats = req.query.mediaFormats
    let expandVal = req.query.expand
    let maxWaitMs = req.query.maxWaitMs
    let formatId = req.query.formatId
    let download = req.query.download
    let fileName = req.query.fileName
    newPath = updateQueryStringParameter(newPath, 'mediaFormats',  mediaFormats);
    newPath = updateQueryStringParameter(newPath, 'expand',  expandVal);
    newPath = updateQueryStringParameter(newPath, 'maxWaitMs',  maxWaitMs);
    newPath = updateQueryStringParameter(newPath, 'formatId',  formatId);
    newPath = updateQueryStringParameter(newPath, 'download',  download);
    newPath = updateQueryStringParameter(newPath, 'maxWaitMs',  fileName);
    // newPath = updateQueryStringParameter(newPath, 'expand',  'agent');
    // newPath = updateQueryStringParameter(newPath, 'expand',  'evaluator');
    // newPath = updateQueryStringParameter(newPath, 'client_secret',  clientSecret);
    return newPath;
  },
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



app.listen(process.env.PORT || 8088, () => {
  console.info('proxy server is running on port 8088')
})