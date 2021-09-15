import * as core from '@actions/core';
import { readFile } from 'fs';
import got from 'got/dist/source';
import path from 'path';
import * as process from 'process';
import * as Converter from 'swagger2-postman2-converter';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

async function run(): Promise<void> {
  const postmanAPIKey = core.getInput('postmanAPIKey');
  const postmanCollectionID = core.getInput('postmanCollectionID');
  const swaggerPath = core.getInput('swaggerPath');

  core.debug(
    `got inputs: ${JSON.stringify({
      postmanAPIKey,
      postmanCollectionID,
      swaggerPath,
    })}`,
  );

  const filePath = path.join(
    process.env.GITHUB_WORKSPACE ?? __dirname,
    swaggerPath,
  );

  core.debug(`reading swagger from path ${filePath}`);

  const buffer = await readFileAsync(filePath);
  const swagger = JSON.parse(buffer.toString());

  const postman = Converter.convert(swagger);

  const res = await got(
    `https://api.getpostman.com/collections/${postmanCollectionID}`,
    {
      method: 'PUT',
      headers: {
        'Cache-Control': 'no-cache',
        'X-Api-Key': postmanAPIKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postman),
    },
  );

  core.debug(res.body);
}

run();
