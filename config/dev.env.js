'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
  //BASE_API: '"http://api.ghysjt.com/api/v1"',
  //BASE_API: '"http://192.168.1.174:8081/api/v1"',
    
    proxyTableBASE_API: '"http://192.168.0.211:8082/api/admin"',
    BASE_API:'"http://192.168.0.211:8082/api/admin"',
   //uploadUrl:'"http://ctdu.min-hotel.com/api/admin/putFile"'
    uploadUrl:'"/api/putFile"'
})
