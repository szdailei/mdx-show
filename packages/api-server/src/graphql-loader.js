import { buildSchema } from 'graphql/index.mjs';
import typeDef from './types';
import resolverArray from './resolvers';

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
