export default `
type Query {
    getFileList(dir:String!): [String]    
    getFile(file:String!): String
}
`;
