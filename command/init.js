const inquirer = require('inquirer')
const chalk =require('chalk')
const shell = require('shelljs');
chalk.level = 3 // 设置chalk等级为3
const fs = require('fs')
const ejs = require('ejs')

const defaultOption = {
    BASE_URL: '/'
}

const extend = (o, j) => {
    for (let k in j) {
        if (Object.hasOwnProperty.call(j, k)) {
            o[k] = j[k]
        }
    }
    return o;
}

module.exports = ()=>{
    let prompts = [{
        type:'input', // 问题类型为填空题
        message:'your  projectName:', // 问题描述
        name:'projectName', // 问题答案对应的属性，用户输入的内容被存储在then方法中第一个参数对应的该属性中
        validate:val=>{ // 对输入的值做判断
            if(val===""){
                return chalk.red('项目名不能为空，请重新输入')
            }
            return true
        }
    },{
        type:'input',
        message:'your version:',
        name:'version',
        default:'1.0.0'
    },{
        type:'confirm',
        message:'use vuex?',
        name:'useVuex',
        default:true
    },{
        type:'confirm',
        message:'use vue router?',
        name:'useVueRouter',
        default:true
    },{
        type:'list',
        message:'the UI library :',
        name:'UIfrag',
        choices:[
            {name:'no UI library ',value:'none'},
            {name:'element-ui',value:'eleUI'}
        ]
    },{
        type:'list',
        message:'the css preprocessing language:',
        name:'cssPrep',
        choices:[
            {name:'no preprocess',value:'none'},
            {name:'less',value:'less'},
            {name:'sass',value:'sass'}
        ]
    }]
    inquirer.prompt(prompts).then(answer=>{ // 通过用户的输入进行各种操作
        console.log(chalk.green('开始初始化文件\n'))
        console.log(chalk.gray('初始化中...'))
        const gitUrl = 'https://github.com/Ami-mi-mi/vue-template.git'
        if (fs.existsSync(answer.projectName)) {
            fs.rmSync(answer.projectName, { recursive: true, force: true })
        }
        shell.exec(`git clone ${gitUrl} ${answer.projectName}`,(error,stdout,stderr)=>{ // 克隆模板并进入项目根目录
            console.log(chalk.green('模板下载完毕'))
            if (error) { // 当有错误时打印出错误并退出操作
                console.log('error: ', error);
                console.log(chalk.red('拷贝文件失败'))
                process.exit()
            }
            // 当配置vuex时进行的操作
            if(answer.useVuex){
                fs.mkdirSync(`${process.cwd()}/${answer.projectName}/src/store`)
                fs.mkdirSync(`${process.cwd()}/${answer.projectName}/src/store/modules`)
                fs.mkdirSync(`${process.cwd()}/${answer.projectName}/src/store/modules/module`)
                let moduleFiles = ['index.js','modules/module/actions.js','modules/module/getters.js','modules/module/index.js','modules/module/mutations.js','modules/module/state.js']
                moduleFiles.forEach(val=>{
                    let fileData = fs.readFileSync(__dirname+`/../templates/vuex/${val}`)
                    fs.writeFileSync(`${process.cwd()}/${answer.projectName}/src/store/${val}`,fileData)
                })
                console.log(chalk.green('vuex配置完成'))
            }
            // 当配置vue-router时进行的操作
            if(answer.useVueRouter){
                fs.mkdirSync(`${process.cwd()}/${answer.projectName}/src/router`)
                let moduleFiles = ['router/index.js']
                moduleFiles.forEach(val=>{
                    let fileData = fs.readFileSync(__dirname+`/../templates/vue-router/${val}`)
                    fs.writeFileSync(`${process.cwd()}/${answer.projectName}/src/${val}`,fileData)
                })
                console.log(chalk.green('vue-router配置完成'))
            }
            let files = ['public/index.html','src/App.vue','src/main.js','package-lock.json','package.json', 'README.md']
            new Promise(resolve=>{
                files.forEach((val,index)=>{
                    ejs.renderFile(`${answer.projectName}/${val}`, extend(answer, defaultOption),(err,str)=>{
                        fs.writeFile(`${answer.projectName}/${val}`,str,()=>{
                            if(index===files.length-1){
                                resolve()
                            }
                        })                       
                    })
                })
            }).then(()=>{
                console.log(chalk.green('模板拷贝完成\n'))
                console.log(chalk.gray('安装依赖包中...'))
                shell.cd(`${answer.projectName}`)
                shell.exec(`npm i`,(err,stdout,stderr)=>{
                    console.log(chalk.green('依赖包下载完毕'))
                    if (error) { // 当有错误时打印出错误并退出操作
                        console.log(chalk.red('拷贝文件失败'))
                        process.exit()
                    }
                    console.log(chalk.green('初始化完成'))
                    process.exit() // 退出这次命令行操作
                })
            })
        })
    })
}