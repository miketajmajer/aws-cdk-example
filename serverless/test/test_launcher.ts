import { handler } from "../src/services/spaces/handler";

// run lambda
handler({
  httpMethod: 'GET',
  //httpMethod: 'POST',
  queryStringParameters: {
    id: 'c2e43fd5-84e2-476c-82e9-48a527c43d97',
  },
  //body: JSON.stringify({ location: "Albuquerque, New Mexico" })
} as any, {} as any).then(result => {
  console.log(result);
});