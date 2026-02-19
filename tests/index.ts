import fs from "node:fs/promises";
import { LxnsApiClient } from "../dist/index.js";

const client = new LxnsApiClient({
  devAccessToken: "",
  personalAccessToken: "",
});

const file = await client.maimai.getAsset("jacket", 114);
await fs.writeFile("114.png", file);
