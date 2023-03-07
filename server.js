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
    let divisionId = req.query.divisionId
    let pageNumber = req.query.pageNumber
    let pageSize = req.query.pageSize
    let sortOrder = req.query.sortOrder
    let name = req.query.name
    let onlyLatestPerContext = req.query.onlyLatestPerContext
    newPath = updateQueryStringParameter(newPath, 'mediaFormats', mediaFormats);
    newPath = updateQueryStringParameter(newPath, 'expand', expandVal);
    newPath = updateQueryStringParameter(newPath, 'maxWaitMs', 5000);
    newPath = updateQueryStringParameter(newPath, 'formatId', formatId);
    newPath = updateQueryStringParameter(newPath, 'download', true);
    newPath = updateQueryStringParameter(newPath, 'fileName', fileName);
    newPath = updateQueryStringParameter(newPath, 'divisionId', divisionId);
    newPath = updateQueryStringParameter(newPath, 'pageNumber', pageNumber);
    newPath = updateQueryStringParameter(newPath, 'pageSize', pageSize);
    newPath = updateQueryStringParameter(newPath, 'sortOrder', sortOrder);
    newPath = updateQueryStringParameter(newPath, 'name', name);
    newPath = updateQueryStringParameter(newPath, 'onlyLatestPerContext', true);
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