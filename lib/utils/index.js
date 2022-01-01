const inquirer = require("inquirer");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");
const bcrypt = require("bcryptjs");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// directory
const pdir = path.join(__dirname, "../../");
const cdir = path.join(__dirname, "../");

// chalk utilities
const error = chalk.bold.red;
const success = chalk.bold.green;

class Util {
  genid() {
    return uuid().replace("-", "").slice(0, 10);
  }

  log(msg) {
    return console.log(msg);
  }

  genHash(str) {
    if (!hash || hash === "" || hash === undefined) {
      return "Hashing string is required";
    }

    return bcrypt.hashSync(str, 10);
  }

  compareHash(str, hash) {
    if (!str || str === "" || str === undefined) return false;
    if (!hash || hash === "" || hash === undefined) return false;

    return bcrypt.compareSync(str, hash);
  }

  createFile(filename) {
    let fname = `${filename}.json`;
    let data = "";
    let msg = {};
    fs.writeFile(fname, data, (err) => {
      if (err) {
        return (msg["error"] = "Error creating file.");
      }

      return (msg["success"] = "file created successfully");
    });
    return msg;
  }

  ANCII(text) {
    return chalk.green(
        figlet.textSync(text, { horizontalLayout: "full" })
    );
  }

  // questions
  authQuestions() {
    const questions = [
      {
        name: "username",
        type: "input",
        message: success("Provide your github username: "),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return error("Username cant be empty");
          }
        },
      },
      {
        name: "password",
        type: "password",
        message: success("Provide your github password: "),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return error("Password cant be empty");
          }
        },
      },
    ];

    return inquirer.prompt(questions);
  }

  // initquestions
  async initQuestions() {
    const questions = [
      {
        name: "app_name",
        type: "input",
        message: success("Application Name: "),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return error("Username cant be empty");
          }
        },
      },
    ];

    return inquirer.prompt(questions);
  }

  // init
  async initGitpod() {
    // create an empty working folder
    let dirname = await this.initQuestions();
    const dir = path.join(__dirname, dirname.app_name);
    try {
        fs.mkdir(dir, (err) => {
            if (err) {
              return this.log(`error creating ${dirname}`);
            }
      
            const cmd = `
                      git init
                      git add .
                      git commit -m "first commit from gitpod :)"
                  `;
      
            this.log("folder created");
          });
    } catch (e) {
        return this.log("something went wrong")
    }
  }
}

module.exports = new Util();
