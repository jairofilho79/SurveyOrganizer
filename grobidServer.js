
const exec = require('child_process').exec;
const fs = require('fs');

const slash = process.platform == 'win32' ? '\\' : '/';
let grobid_path;
let grobid_client_path;

//Refatorado. Agora a pessoa adiciona o grobid pela linha de comando, em qualquer SOe nao fica na propria pasta, fica na pasta temp. Sem dar conflito com o github.
const platformASpath = process.platform === "darwin" || process.platform === "linux" ? "/var/tmp/" : process.platform === "win32" ? String(process.env.temp) : false;

let configFile;
if (!fs.existsSync(`${platformASpath}config_sorg.json`)) {

    const inquirer = require('inquirer');

    let questions = [
        {
            type: 'input',
            name: 'grobid_path',
            message: "What's the GROBID path?",
            validate: function(value) {
                if(value.length > 0) return true;
                return 'Please, set a path.';
            }
        },
        {
            type: 'input',
            name: 'grobid_client_path',
            message: "What's the Node.js GROBID client path?",
            validate: function(value) {
                if(value.length > 0) return true;
                return 'Please, set a path.';
            }
        }
    ]

    deasync(inquirer.prompt(questions).then(answers => {
        const jsonPaths = `
            {
                "grobid_path":"${answers['grobid_path']}",
                "grobid_client_path":"${answers['grobid_client_path']}"

            }
        `;
        configFile = JSON.parse(jsonPaths);
        fs.writeFileSync(`${platformASpath}${slash}config_sorg.json`,jsonPaths);
        setGrobidPaths()
    }))

} else {
    configFile = JSON.parse(fs.readFileSync(`${platformASpath}config_sorg.json`).toString('utf8'));
    setGrobidPaths()
}

function setGrobidPaths() {
    grobid_path = configFile.grobid_path;
    grobid_client_path = configFile.grobid_client_path;
    if(grobid_client_path === '' || grobid_path === '') {console.log(`Please, set the grobid paths on config.json at: ${platformASpath}${slash}config_sorg.json`); return;}
    startGrobidServer();
}

function startGrobidServer() {
    const grobid_client_port = JSON.parse(fs.readFileSync(`${grobid_client_path}${process.platform == 'windows' ? '\\' : '/' }config.json`)).grobid_port;

    try {
        exec(`./gradlew run`,{cwd: grobid_path});
        console.log(`Foi ao ligar o servidor do GROBID`);
    }
    catch(e) {
        console.log(e);
    }
}

