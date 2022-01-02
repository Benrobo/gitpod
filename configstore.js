const fs = require("fs");
const path = require("path");
const os = require("os");

/** Tip: on macOS, you’ll find the file in 
 * mac
    /Users/[YOUR-USERNME]/.config/configstore/ginit.json. 
    linux
    /home/[YOUR-USERNME]/.config/configstore/ginit.json.
    win
    C:\Users\[username] 
**/

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
        project_name: this.package_name,
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

    throw Error(
      "Error occured getting config content, pls restart and try again"
    );
  }

  set(packageName, gtoken) {
    if (
      !packageName ||
      packageName === "" ||
      packageName === undefined ||
      gtoken === "" ||
      gtoken === undefined ||
      !gtoken
    ) {
      throw Error(
        "expected valid parameters (package_name, token) but got none"
      );
    }

    let { project_name, token } = this.get();

    if (packageName === project_name) {
      let newData = {
        ...this.get(),
        token: gtoken,
      };

      fs.writeFileSync(gitpodFileJson, JSON.stringify(newData));

      return console.log("config updated");
    }

    throw Error("package name is invalid");
  }
};
