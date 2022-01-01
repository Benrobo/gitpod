git branch -M main
git remote add origin https://github.com/Benrobo/gitpod.git
git push -u origin main


const { Command } = require('commander')
const program = new Command()

program 
  .option('-d, --debug', 'output extra debugging') 
  .option('-s, --small', 'small pizza size') 
  .option('-p, --pizza-type <type>', 'flavour of pizza', 'peperoni') // default
  .parse(process.argv)

if (program.debug) 
  console.log(program.opts())
console.log('pizza details:')
if (program.small)
  console.log('- small pizza size')
if (program.pizzaType)
  console.log(`- ${program.pizzaType}`);