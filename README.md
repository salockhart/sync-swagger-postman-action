## Sync a Swagger 2.0 file to Postman

See also: [loopDelicious/converter](https://github.com/loopDelicious/converter)

To use, first [generate a Postman API token](https://www.postman.com/) and [add it as a secret to your repo](https://docs.github.com/en/actions/reference/encrypted-secrets)

Then, find the ID of the collection that you want to sync to. This can be as
easy as calling:

```
curl --location \
  --request GET \
  'https://api.getpostman.com/collections' \
  --header 'X-API-Key: paste your postman key here'
```

and finding your collection in the response.

Then, create a new workflow, passing in the created secret, the ID of your
collection, and the path to your Swagger file.

```
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: salockhart/sync-swagger-postman-action@v1
        with:
          postmanAPIKey: ${{ secrets.POSTMAN_API_KEY }}
          postmanCollectionID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          swaggerPath: swagger.json
```

Done!
