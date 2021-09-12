import * as core from '@actions/core';
import { readFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

async function run(): Promise<void> {
  const postmanAPIKey = core.getInput('postmanAPIKey');
  const swaggerPath = core.getInput('swaggerPath');
  core.debug(
    `got inputs: postmanAPIKey=${postmanAPIKey} swaggerPath=${swaggerPath}`,
  );

  const filePath = path.join(__dirname, swaggerPath);
  core.debug(`reading swagger from path ${filePath}`);

  const buffer = await promisify(readFile)(filePath);
  core.debug(buffer.toString());
}

run();

// var fs = require('fs'),
//     Converter = require('swagger2-postman2-converter'),
//     request = require('request'),
//     config = require('./config.js');

// // ###############################################
// // define functions to handle conversion and update collection

// function handleConversion(originalFileName, newFileName) {

//     // read the local swagger file
//     var swaggerObject = JSON.parse(
//         fs.readFileSync(originalFileName, 'utf8')
//     );

//     // convert Swagger 2.0 to Postman 2.0
//     var conversionResult = Converter.convert(swaggerObject);

//     // create a new local file in Postman v2.0 format
//     fs.writeFileSync(newFileName, JSON.stringify(conversionResult.collection, null, 2));
//     console.log('Converted ' + originalFileName + ' to ' + newFileName);

// }

// function updateLocalCollection(newFileName, newFile) {

//     // update the local Postman collection file
//     fs.writeFileSync('./' + newFileName, JSON.stringify(newFile, null, 2));
//     console.log('writing to ' + newFileName);

// }

// function updatePostman(newFileName, collection_uid) {

//     // read the updated local file and update the Postman collection using Postman API
//     var data = fs.readFileSync('./' + newFileName, 'utf8');

//     // Postman users can get a Postman API key here: https://app.getpostman.com/dashboard/integrations
//     var postmanAPIKey = config.key;

//     // compile PUT request to update the Postman collection
//     var putOptions = {
//         method: 'PUT',
//         url: 'https://api.getpostman.com/collections/' + collection_uid,
//         qs: {
//             format: '2.1.0'
//         },
//         headers: {
//             'Postman-Token': '4122abb3-6098-6906-e172-49334961f595',
//             'Cache-Control': 'no-cache',
//             'X-Api-Key': postmanAPIKey,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.parse(data),
//         json: true
//     };

//     // submit PUT request to update the Postman collection
//     request(putOptions, function (error, response, body) {
//         if (error) throw new Error(error);
//         console.log(body);
//     });

// }

// function updateCollection(newFileName) {

//     // update the Postman collection locally and in the cloud
//     var data = fs.readFileSync('./' + newFileName, 'utf8');

//     // search the config for the collection in the read file
//     var file = JSON.parse(data);
//     var coll = config.collections.find( function (coll) {
//         return coll.to === newFileName.split('.')[0];
//     });

//     // update properties in file, and determine collection uid
//     file.info.id = coll.collection_id; // update id according to config file
//     file.info._postman_id = file.info.id; // add new property that is identical to id
//     var newFile = {};
//     newFile.collection = file; // wrap JSON object in new "collection" property

//     // call function to update the local collection file
//     // and then call function to update the cloud version of the Postman collection using Postman API
//     updateLocalCollection(newFileName, newFile);
//     updatePostman(newFileName, coll.collection_uid);

// }

// // ###############################################
// // loop through collections in config file to call functions to handle conversion and update collection

// config.collections.forEach( function (collection) {

//     var originalFileName = collection.from + ".json";
//     var newFileName = collection.to + ".json";

//     handleConversion(originalFileName, newFileName);
//     updateCollection(newFileName);

// });
