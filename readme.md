## gitpod :- /git-p^ud/
#### A cli application meant for automating project creation work flow

gitpod allows users to 

1. create a new working project directory.
2. initialized an empty git repositories with just a command.
3. commit working directory to user github.
4. push working directory to github.

### Using github locally.

#### Steps to run gitpod locally.

##### Disclaimer

gitpod is a personal tools meant for developer, it not a production ready tool and it still under development. use at your own risk.

##### Step 1

- Make sure you have <code>nodejs</code> and <code>git</code> installed ready on your system.

##### Step 2
- clone or download this repo.

```javascript
    git clone https://github.com/Benrobo/gitpod.git
```
##### Step 3
- move into the directory you cloned and run the below command

```javascript
    npm install
    nom link
```

##### Step 4
- run github globally where you need a new project to be created

```javascript
    gitpod --init
```

##### Step 5
- gitpod makes use of users github personal access token to make actions to users repository. you can get yours by following this steps here [Github Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

- when it ask for your token, copy the token you created and paste it into the cli

##### Step 6

- follow the information provided by gitpod.

##### Step 7

- youre good to go.


#### Any issues

create an issue here [gitpod issues](https://github.com/Benrobo/gitpod/issues).
