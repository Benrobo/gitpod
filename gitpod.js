#!/usr/bin/env node

const chalk = require("chalk")
const { Command } = require("commander");

const program = new Command()

const v = "0.0.1";

program.version(v);

// log
const log = console.log

const util = require("./lib/utils/index");

log(util.ANCII("gitpod"));

program
  .option("-v, --version", "extra information for gitpod")
  .option("-l, --login", "log in into gitpod using github acct")
  .option("-i, --init", "initialize gitpod")
  .parse(process.argv)


const opt = program.opts();


if (opt.v || opt.version) {
    log("")
    return log("version number")
} else if (opt.i || opt.init) {
  async function run(){
    return await util.initGitpod();
  }
  run()
}
else{
    chalk.red("command is invalid")
}
