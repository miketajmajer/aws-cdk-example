import { handler } from "../src/services/spaces/handler";

// run lambda
handler({
  httpMethod: 'DELETE',
  //httpMethod: 'PUT',
  //httpMethod: 'GET',
  //httpMethod: 'POST',
  queryStringParameters: {
    id: '2571d2e6-218f-4b3f-95e6-0e81c297a5b5',
  },
  body: JSON.stringify({ location: "South Broadway, Albuquerque, New Mexico" })
} as any, {} as any).then(result => {
  console.log(result);
});