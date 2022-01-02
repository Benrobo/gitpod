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

  async askToken() {
    const questions = [
      {
        name: "token", // personal access token
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
        type: "input",
        name: "description",
        message: success("Description: "),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return error("description cant be empty");
          }
        },
      },
      {
        type: "list",
        name: "visibility",
        choices: ["public", "private"],
        default: "public",
        message: success("Public or Private"),
      },
    ];

    return inquirer.prompt(questions);
  }

  // init
  async initGitpod() {
    const { app_name, visibility, description } = await this.initQuestions();

    // check if token is present in users home directory
    //  if it is, just give the user from there else
    // ask for PAT

    // Create a Configstore instance.
    const configstore = new ConfigStore(app_name);

    const PAT = await this.askToken();
    const configToken = configstore.get();
    const checkPAT =
      configToken.token === "" || !configToken.token ? PAT : configToken;

    // init octokit/rest auth
    const githubAuth = new Octokit({
      auth: checkPAT.token,
    });

    // store token in gitpod.json file in os home directory
    configstore.set(checkPAT.token);

    console.log(checkPAT.token);

    const dir = path.join(__dirname, app_name);

    try {
      if (fs.existsSync(dir) === false) {
        const ignore = `/node_modules` + "\n";
        fs.mkdirSync(dir);
        fs.writeFileSync(`${dir}/.gitignore`, ignore);
        return;
      }

      const githubData = {
        name: app_name,
        description,
        private: visibility,
      };

      try {
        const response = await githubAuth.repos.createForAuthenticatedUser(
          githubData
        );

        const remoteUrl = response.data.ssh_url;
        // 'git@github.com:Benrobo/demoTest.git'

        const cmd = `
          cd ${dir} npm init -y && git init && git add . && git commit -m "first commit" && git branch -M main && git remote add origin ${remoteUrl} && git push -u origin main
        `;

        // execute the command above

        exec(cmd, (err) => {
          if (err) {
            return error(
              this.log("Something went wrong, could not create or push to remo")
            );
          }
          this.log("");
          return success(
            this.log("gitpod successfully created new working environment..")
          );
        });
      } catch (e) {
        error(console.log(e));
        return error(this.log("Something went wrong creating remote repo"));
      }
    } catch (e) {
      error(console.log(e));
      return this.log("something went wrong, creating repo folder");
    }
  }
}

module.exports = new GitPod();
