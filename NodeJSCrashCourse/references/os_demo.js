const { constants } = require('buffer');
const os = require('os');

//Platform
console.log(os.platform());

//CPU Arch
console.log(os.arch());

//CCPU Core Info
console.log(os.cpus());

//free memory
console.log(os.freemem());

//total memory
console.log(os.totalmem());

//Home dir
console.log(os.homedir());

//Uptime
console.log(os.uptime());
