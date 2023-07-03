import {createProductByReferenceKeyRequest} from '../productByReferenceKey';

it('Builds correct query', () => {
  expect(
    createProductByReferenceKeyRequest({
      referenceKey: '122222051352_990',
    }),
  ).toMatchInlineSnapshot(`
{
  "endpoint": "products",
  "method": "GET",
  "params": {
    "referenceKey": "122222051352_990",
  },
}
`);

  expect(
    createProductByReferenceKeyRequest({
      referenceKey: '122222051352_990',
      with: {
        attributes: 'all',
        variants: {
          attributes: {
            withKey: ['name'],
          },
        },
      },
      includeSellableForFree: false, // don't send, it's the default
    }),
  ).toMatchInlineSnapshot(`
{
  "endpoint": "products",
  "method": "GET",
  "params": {
    "referenceKey": "122222051352_990",
    "with": "attributes,variants,variants.attributes:key(name),images.attributes:legacy(false)",
  },
}
`);

  expect(
    createProductByReferenceKeyRequest({
      referenceKey: '122222051352_990',
      includeSellableForFree: true,
    }),
  ).toMatchInlineSnapshot(`
{
  "endpoint": "products",
  "method": "GET",
  "params": {
    "includeSellableForFree": true,
    "referenceKey": "122222051352_990",
  },
}
`);

  expect(() =>
    createProductByReferenceKeyRequest({
      referenceKey: '',
    }),
  ).toThrow(`"referenceKey" must not be an empty string.`);

  expect(
    createProductByReferenceKeyRequest({
      referenceKey: '122222051352_990',
      pricePromotionKey: 'abc123',
    }),
  ).toMatchInlineSnapshot(`
{
  "endpoint": "products",
  "method": "GET",
  "params": {
    "pricePromotionKey": "abc123",
    "referenceKey": "122222051352_990",
  },
}
`);
});
