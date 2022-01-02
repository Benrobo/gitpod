const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

/** Tip: on macOS, you’ll find the file in 
 * mac
    /Users/[YOUR-USERNME]/.config/configstore/ginit.json. 
    linux
    /home/[YOUR-USERNME]/.config/configstore/ginit.json.
    win
    C:\Users\[username] 
**/

// chalk utilities
const error = chalk.bold.red;
const success = chalk.bold.green;

const home = os.userInfo().homedir;

const osdir = {
  Linux: home,
  Darwin: home,
  Windows_NT: home,
};

const dir = path.join(home, "/gitpod");
const gitpodFileJson = `${dir}/gitpod.json`;

module.exports = class ConfigStore {
  constructor(pkgname) {
    this.package_name = pkgname;
    // check if folder exisi
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir);
      // create a json file

      const gitpodjson = {
        token: "",
      };

      fs.writeFileSync(gitpodFileJson, JSON.stringify(gitpodjson));

      console.log("file created");
    }
  }

  get() {
    // check if file exist
    if (fs.existsSync(gitpodFileJson)) {
      let data = fs.readFileSync(gitpodFileJson);
      let res = JSON.parse(data);
      return res;
    }

    console.log(
      error("Error occured getting config content, pls restart and try again")
    );
  }

  set(gtoken) {
    if (gtoken === "" || gtoken === undefined || !gtoken) {
      console.log(error("expected valid parameters (token) but got none"));
    }

    // let { token } = this.get();

    let newData = {
      token: gtoken,
    };

    fs.writeFileSync(gitpodFileJson, JSON.stringify(newData));
  }

  clear() {
    const gitpodjson = {
      token: "",
    };

    fs.writeFileSync(gitpodFileJson, JSON.stringify(gitpodjson));
  }
};
