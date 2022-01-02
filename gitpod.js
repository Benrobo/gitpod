const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const ConfigStore = require("./util/configstore");

const { Octokit } = require("@octokit/rest");

// directory
const home = process.cwd();

// chalk utilities
const error = chalk.red;
const success = chalk.green;

class GitPod {
  log(msg) {
    return console.log(msg);
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
    let errorCount = 0;

    const { app_name, visibility, description } = await this.initQuestions();

    // Create a Configstore instance.
    const configstore = new ConfigStore(app_name);

    // const PAT = await this.askToken();
    const configToken = configstore.get();

    const checkPAT =
      configToken.token === "" || !configToken.token
        ? await this.askToken()
        : configToken;

    // init octokit/rest auth
    const githubAuth = new Octokit({
      auth: checkPAT.token,
    });

    // store token in gitpod.json file in os home directory
    configstore.set(checkPAT.token);

    const dir = path.join(home, app_name);

    try {
      const githubData = {
        name: app_name,
        description,
        private: visibility === "public" ? false : true,
      };

      const response = await githubAuth.repos.createForAuthenticatedUser(
        githubData
      );

      const remoteUrl = response.data.clone_url;

      if (response.status === 201 || response.status === 200) {
        if (fs.existsSync(dir) === false) {
          const ignore = `/node_modules` + "\n";
          const readme = "### Readme generated using gitpod";
          fs.mkdirSync(dir);
          fs.writeFileSync(`${dir}/.gitignore`, ignore);
          fs.writeFileSync(`${dir}/readme.md`, readme);
        }

        const cmd = `
            cd ${dir} && npm init -y && git init && git add . && git commit -m "first commit" && git branch -M main && git remote add origin ${remoteUrl} && git push -u origin main
          `;

        // execute the command above
        this.log("");
        this.log(success("creating repo..."));

        return exec(cmd, (err) => {
          if (err) {
            this.log(err);
            return error(
              this.log("Something went wrong, could not create or push to remo")
            );
          }
          this.log("");
          return success(
            this.log("gitpod successfully created new working environment..")
          );
        });
      }

      return this.log(
        error(
          "failed to create remote repo. eitheir token is invalid or you're not connected to internet."
        )
      );
    } catch (e) {
      errorCount += 1;
      if (errorCount >= 1) {
        // this would clear the default user token from pc and then ask the user for a new one
        configstore.clear();
      }
      return this.log(error("Something went wrong creating remote repo", e));
    }
  }
}

module.exports = new GitPod();
