import { handler } from "../src/services/spaces/handler";

// run lambda
handler({
  //httpMethod: 'DELETE',
  //httpMethod: 'PUT',
  httpMethod: 'GET',
  //httpMethod: 'POST',
  queryStringParameters: {
    id: '0d86a859-305f-4c71-a293-7752d718440a',
  },
  body: JSON.stringify({ location: "South Broadway, Albuquerque, New Mexico", name: "home" })
} as any, {} as any).then(result => {
  console.log(result);
});