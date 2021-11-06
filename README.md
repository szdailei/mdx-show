# Write with MDX, slides show with browser

## Installation

**CLI:** `yarn add mdx-show`

## Usage

**CLI**

Serve online:

```bash
$ yarn mdx-show // serve your working folder
$ yarn mdx-show -m your_mdx_folder // serve special folder
$ yarn mdx-show -h // display help info
visit http://localhost:3000
```

Export to PDFs

```bash
$ yarn mdx-show // serve your working folder
$ yarn mdx-show-pdfs // export all MD/MDX to PDFs
```

**Programmatically:**

```
import {mdxShow} from 'mdx-show'

mdxShow({options})
```

```
import pdfs from 'mdx-show/pdfs'

pdfs({options})
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Dai Lei <szdailei@gmail.com>
