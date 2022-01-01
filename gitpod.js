// #!/usr/bin/env node

const { program } = require("commander");
const v = "0.0.1";
program.version(v);

// log
const log = console.log

const { genHash, authQuestions, initGitpod, ANCII } = require("./lib/utils/index");

log(ANCII("gitpod"));

program
  .option("-v, --version", "extra information for gitpod")
  .option("-l, --login", "log in into gitpod using github acct")
  .option("-i, --init", "initialize gitpod");

program.parse(process.argv);

const opt = program.opts();


// if (options.v || options.version) {
//   return console.log("chalk.green(version)");
// } else if (options.i || options.init) {
//   async function run(){
//     return await initGitpod();
//   }
//   run()
// }
// else{
//     chalk.red("command is invalid")
// }
