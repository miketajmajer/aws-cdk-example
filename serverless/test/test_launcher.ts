import { handler } from "../src/services/spaces/handler";

// run lambda
handler({} as any, {} as any).then(result => {
  console.log(result);
});