import { LxnsApiClient } from "../dist/index.js";
import fs from "node:fs/promises";

const client = new LxnsApiClient();

const file = await client.maimai.getAsset("jacket", 114);
await fs.writeFile("114.png", file);
