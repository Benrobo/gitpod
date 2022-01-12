import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

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

const dir = path.join(home, "/gitpod");
const gitpodFileJson = `${dir}/gitpod.json`;

export default class ConfigStore {
  constructor(pkgname) {
    this.package_name = pkgname;
    // check if folder exisi
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir);

      const gitpodjson = {
        token: "",
      };

      fs.writeFileSync(gitpodFileJson, JSON.stringify(gitpodjson));
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
}
