# Write MDX, slides show based on browser or pdf

## Build

```bash
git clone https://github.com/szdailei/mdx-show
cd mdx-show
yarn
yarn build
```

## Bundle

```bash
yarn pkg-fetch    // fetch nodejs binary to cache dir.
yarn bundle
```
## Prepare 

Copy your MDX files to dist, or create dist/web/mdx-show.toml and add static-server.root

Default configuration of mdx-show.toml:
```
[static-server]
port = 3000
root = 'web'  # Web服务的根目录，此目录必须有index.html

[api-server]
port = 3001

[download-server]
port = 3002

[storage]
root = '.' # 存放mdx文件的目录
```

## Run servers

```bash
node dist/index.js or ./dist/mdx-show-linux
```

## Export MDXs to PDFs

```bash
Run servers
cd test
yarn export // export to pdfs folder.
```

## Slides show 

There are three methods to slides show:
1. Open pdf file by pdf reader.
2. Copy dist/mdx-show.html to MDXs folder, then open mdx-show.html by browser and select a MDX file.
3. Run servers, then open web site and select one MDX file.
