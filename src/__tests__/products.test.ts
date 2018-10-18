import {createProductsSearchEndpointRequest} from 'bapi/endpoints/products';
import {execute} from 'bapi/helpers/execute';
import {
  nockWithBapiScope,
  disableNetAndAllowBapiCors,
} from 'bapi/test-helpers/nock';
import {createProductByIdEndpointRequest} from 'bapi/endpoints/productById';

disableNetAndAllowBapiCors();

test('Fetch category products', async () => {
  nockWithBapiScope()
    .defaultReplyHeaders({'access-control-allow-origin': '*'})
    .get(
      `/v1/products?filters%5Bcategory%5D=20201&sortScore=category_scores&sortChannel=etkp&perPage=2`,
    )
    // .query({ ... })
    .replyWithFile(200, __dirname + '/responses/products.json', {
      'Content-Type': 'application/json',
    });

  const result = await execute(
    'https://api-cloud.example.com/v1/',
    139,
    createProductsSearchEndpointRequest({
      where: {
        categoryId: 20201,
      },
      pagination: {
        perPage: 2,
      },
      sort: {
        score: 'category_scores',
        channel: 'etkp',
      },
    }),
  );

  expect(result.data.entities.length).toBe(2);

  return true;
});

test('Fetch unavailable product', async () => {
  nockWithBapiScope()
    .defaultReplyHeaders({'access-control-allow-origin': '*'})
    .get(`/v1/products/123`)
    .replyWithFile(404, __dirname + '/responses/product-not-found.json', {
      'Content-Type': 'application/json',
    });

  try {
    await execute(
      'https://api-cloud.example.com/v1/',
      139,
      createProductByIdEndpointRequest({
        productId: 123,
      }),
    );
  } catch (e) {
    expect(e.message).toBe(`Request failed with status code 404`);
    return;
  }

  fail('Expected exception');
});
