import { buildSchema } from 'graphql/index.mjs';
import typeDef from './types.js';
import resolverArray from './resolvers/index.js';

function getResolvers() {
  const obj = {};
  resolverArray.forEach((element) => {
    Object.keys(element).forEach((key) => {
      obj[key] = element[key];
    });
  });
  return obj;
}

const schema = buildSchema(typeDef);
const resolvers = getResolvers();

export { schema, resolvers };
