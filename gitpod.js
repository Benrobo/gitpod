require("dotenv").config();
const inquirer = require("inquirer");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");
const bcrypt = require("bcryptjs");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const ConfigStore = require("./configstore");

const { Octokit } = require("@octokit/rest");

// directory
const pdir = path.join(__dirname);

// chalk utilities
const error = chalk.bold.red;
const success = chalk.bold.green;

// Create a Configstore instance.
const packageName = require("./package.json").name;

const configstore = new ConfigStore(packageName);

// initialize octokit
const githubAuth = new Octokit();

class GitPod {
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
    return chalk.green(figlet.textSync(text, { horizontalLayout: "full" }));
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
      {
        name: "PAT", // personal access token
        type: "input",
        message: success("Your github personal access token: "),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return error("personal access token cant be empty");
          }
        },
      },
      {
        type: "input",
        name: "description",
        message: success("Description: "),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return error("personal access token cant be empty");
          }
        },
      },
      {
        type: "list",
        name: "visibility",
        choices: ["public", "private"],
        default: "public",
        message: success("Private or Public"),
      },
    ];

    return inquirer.prompt(questions);
  }

  // init
  async initGitpod() {
    // create an empty working folder
    let { app_name, PAT, visibility, description } = await this.initQuestions();
    // store token in gitpod.json file in os home directory
    configstore.set(packageName, PAT);
    const dir = path.join(__dirname, app_name);
    try {
      // check if dir exist
      if (fs.existsSync(dir) === false) {
        // create a .gitignore file
        const ignore = `
          /node_modules
        `;
        fs.writeFileSync(`${dir}/.gitignore`, ignore);
        fs.mkdirSync(dir);
        return;
      }

      // const cmd = `cd ${dir} && git init && git add . && git commit -m "first commit"`
      githubAuth.auth(configstore.get().token);

      const githubData = {
        name: app_name,
        description,
        private: visibility,
      };

      try {
        const response = await github.repos.createForAuthenticatedUser(
          githubData
        );
        return chalk.green(this.log(response.data.ssh_url));
      } catch (e) {
        return chalk.red(
          this.log("Something went wrong creating remote repo")
        );
      }
    } catch (e) {
      chalk.red(
        console.log(e)
      );
      return this.log("something went wrong, creating repo folder");
    }
  }
}

module.exports = new GitPod();
