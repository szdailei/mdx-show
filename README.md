# Write with MDX, slides show with browser

## Installation

**CLI:** `yarn add --dev mdx-show`

## Usage

**CLI**

Serve with server:

```bash
$ yarn mdx-show -d ~/working_dir  (default: current dir)
visit http://localhost:3000
```

Export to PDF

```bash
$ yarn mdx-show
$ yarn mdx-show-pdf // export all MD/MDX files to PDFs
```

Serve without server:

```bash
cp ./node_modules/mdx-show/dist/mdx-show.html ~/working_dir
open mdx-show.html    // Note: local subtitles can't be loaded without server
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Dai Lei <szdailei@gmail.com>
