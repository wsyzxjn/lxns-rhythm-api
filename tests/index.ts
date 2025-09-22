import { LxnsApiClient } from "../dist/index.js";
import fs from "node:fs/promises";

const client = new LxnsApiClient();

const file = await client.maimai.getAsset("music", 114);
await fs.writeFile("114.mp3", file);
