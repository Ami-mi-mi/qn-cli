const inquirer = require('inquirer')
const fs = require('fs')

module.exports = ()=>{
    inquirer.prompt([{
        type:'input',
        name:'moduleName',
        message:'the name of module:',
        validate:val=>{
            if(val===""){
                return chalk.red('模板名不能为空，请重新输入')
            }
            return true
        }
    }]).then(answer=>{
        let path = __dirname+'/../templates/vuex/modules/module'
        fs.mkdirSync(`src/store/modules/${answer.moduleName}`)
        let files = fs.readdirSync(path).map(file=>{
            let data = fs.readFileSync(`${path}/${file}`);
            fs.writeFileSync(`src/store/modules/${answer.moduleName}/${file}`,data)
        })
        console.log(chalk.green('文件写入完成'))
        process.exit()
    })
}