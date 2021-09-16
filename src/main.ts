import * as core from '@actions/core';
import { readFile } from 'fs';
import got from 'got/dist/source';
import yaml from 'js-yaml';
import path from 'path';
import * as process from 'process';
import { exit } from 'process';
import * as Converter from 'swagger2-postman2-converter';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

async function readSwagger(swaggerPath: string) {
  const filePath = path.join(
    process.env.GITHUB_WORKSPACE ?? __dirname,
    swaggerPath,
  );

  core.debug(`reading swagger from path ${filePath}`);

  const fileContents = await readFileAsync(filePath, 'utf8');

  if (/.*\.ya?ml/.test(swaggerPath)) {
    return yaml.load(fileContents);
  } else {
    return JSON.parse(fileContents);
  }
}

async function updatePostman(
  postmanAPIKey: string,
  postmanCollectionID: string,
  postman: unknown,
) {
  return await got(
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
}

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

  const swagger = await readSwagger(swaggerPath);
  const postman = Converter.convert(swagger);
  const res = await updatePostman(postmanAPIKey, postmanCollectionID, postman);

  core.debug(res.body);
}

run().catch((e) => {
  core.debug(e);
  core.debug(e.message);
  exit(1);
});
