### Installation

```
cd node-crontab
sudo npm i -g .
```

Then you can do in the command-line:
`node-crontab`

which will open an editor where you can make changes. Changes are saved upon closing the file.

### Editing crontab.json

The config file looks like this:

```json
{
  "[job-name]": {
    "time": "* * * * *",
    "path": "/home/ivan/Desktop/dev/drogba.sh",
    "env": "bash" // default is "node"
  }
}
```

### Editing dynamically

You can also edit cronjobs dynamically:

```js
const crontab = require('node-crontab') // global

crontab.addOrUpdate('bs', {
  time: '52 23 * * *',
  path: process.cwd() + '/' + 'run',
})

crontab.remove('bs')
```
