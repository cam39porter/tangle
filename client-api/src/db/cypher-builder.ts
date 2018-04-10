function buildCreateNode(label: string): string {
  return `CREATE (n:${label})`;
}
//  { let props: string = "{";
//   for (const key in properties) {
//   }
//   `CREATE (n:Capture {id:"${uuid}", body:"${body}", created:TIMESTAMP()})`;
//   return null;
// }
