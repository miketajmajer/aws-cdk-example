import { handler } from "../src/services/hello/hello";

// run lambda
handler({} as any, {} as any).then(result => {
  console.log(result);
});