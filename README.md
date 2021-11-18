# Write with MDX, slides show with browser

## Installation

**CLI:** `yarn add --dev mdx-show`

## Usage

**CLI**

Serve online:

```bash
$ yarn mdx-show -d ~/working_dir  (default: current dir)
visit http://localhost:3000
```

Export to PDF

```bash
$ yarn mdx-show     // serve current dir
$ yarn mdx-show-pdf // export all MD/MDX to PDFs
```

Serve without server:

```bash
cp ./node_modules/mdx-show/dist/mdx-show.html ~/working_dir
open mdx-show.html    // Note: You can't load local subtitles without server
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Dai Lei <szdailei@gmail.com>
