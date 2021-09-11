# pinata-folders
Pin larges directories to pinata

# install
`
npm i pinata-folder
`

# use

```js
const pinataFolders = require('pinata-folder');

// upload large directories without file limit
pinataFolders.pinFolder(key, secret, path, options)
  .then(url => console.log(url))
  .catch(e => console.log(e));
```

# options

remove file extension from ipfs url:

`removeExt: boolean`

set pinata folder name:

`folderName: string`
