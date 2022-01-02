#!/usr/bin/env node

const chalk = require("chalk");
const { Command } = require("commander");

const program = new Command();

const v = "0.0.1";

program.version(v);

// log
const log = console.log;

const gitpod = require("./gitpod");

log(gitpod.ANCII("gitpod"));

program
  .option("-v, --version", "extra information for gitpod")
  // .option("-l, --login", "log in into gitpod using github acct")
  .option("-i, --init", "initialize gitpod")
  .parse(process.argv);

const opt = program.opts();

if (opt.v || opt.version) {
  log("");
  return log("version number");
} else if (opt.i || opt.init) {
  async function run() {
    return await gitpod.initGitpod();
  }
  run();
} else {
  log("");
  log(chalk.red("command is invalid"));
  log("");
  program.options.forEach(option => {
    log(option.flags) 
    log(option.description)
    log("")
  });
}
