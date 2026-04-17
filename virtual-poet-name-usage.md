**Within The App**

Use the file-backed helper from server-side code, where `Poets_Lyricists_Samples.json` lives in the same folder as [virtual-poet-name.ts](/Users/SOON/lyrical-mcp/virtual-poet-name.ts):

```ts
import { generateVirtualPoetNameFromSamplesFile } from "./virtual-poet-name";

const result = await generateVirtualPoetNameFromSamplesFile({
  count: 13,
  seed: 20250403,
  order: 3
});

console.log(result.name);
console.log(result.selected);
```

`result.name` is the synthetic poet name for display and prompt-conditioning. `result.selected` is the independent 13-name inspiration subset to map against `Poets_Lyricists_Samples.json` for poem excerpts.

If you already have the `author` values in memory, keep using the in-memory API:

```ts
import { generateVirtualPoetName } from "./virtual-poet-name";

const result = generateVirtualPoetName(authorNames, {
  count: 13,
  seed: 20250403,
  order: 3
});
```

**Outside The App**

From a Node script:

```ts
import { generateVirtualPoetNameFromSamplesFile } from "./virtual-poet-name.ts";

const result = await generateVirtualPoetNameFromSamplesFile({
  count: 13,
  seed: 20250403,
  order: 3
});

console.log(result);
```

From the terminal with `tsx` in this repo:

```bash
./node_modules/.bin/tsx -e 'import { generateVirtualPoetNameFromSamplesFile } from "./virtual-poet-name.ts"; const result = await generateVirtualPoetNameFromSamplesFile({ count: 13, seed: 20250403, order: 3 }); console.log(result.name); console.log(result.selected);'
```

If the JSON is in another location, pass a second argument:

```ts
const result = await generateVirtualPoetNameFromSamplesFile(
  { count: 13, seed: 20250403, order: 3 },
  "/absolute/path/to/Poets_Lyricists_Samples.json"
);
```
