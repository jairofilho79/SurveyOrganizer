
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const xmlToJSON = require('xmltojson');
xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(string, 'text/xml');

let isServerOn = false; //Verificar se o GROBID foi iniciado e não ficar tentando várias vezes.
// let json = parser.toJson(xml);
// let xml = parser.toXml(json);

let configFile = JSON.parse(fs.readFileSync('config.json').toString('utf8'));

//Usa esse para onde está o teu GROBID. Em breve vamos refatorar isso aqui.
// const grobid_path = `C:\grobid-0.5.4`;
// const grobid_path_client = `C:\\Users\\Jairo\\Desktop\\grobid-client`;
const {grobid_path} = configFile;
const {grobid_client_path} = configFile;

if(grobid_client_path === '' || grobid_path === '') {console.log('Please, set the grobid paths on config.json'); return;}

let in_folder = `${__dirname}${process.platform == 'windows' ? '\\' : '/'}In` //Pasta origem dos pdfs
let out_folder_XML = `${__dirname}${process.platform == 'windows' ? '\\' : '/'}Out_XML` //Pasta destino do xml
let out_folder_JSON = `${__dirname}${process.platform == 'windows' ? '\\' : '/'}Out_JSON` //Pasta destino do xml
let process_type = ""; //Qual tipo de processo vai ser feito (total, só as referências etc)
/*
* processFulltextDocument //Processa o documento inteiro
* processHeaderDocument //Retira apenas o cabeçalho
* processReferences //Somente as referências
* OBS: por padrão, é processado o documento inteiro
* */
console.log('Passou');

const grobid_client_port = JSON.parse(fs.readFileSync(`${grobid_client_path}${process.platform == 'windows' ? '\\' : '/' }config.json`)).grobid_port;

if(!isServerOn) {
    fetch(`http://localhost:${grobid_client_port}/`)
        .catch(e=> {
            console.log(2);
            exec(`gradlew run`,{cwd: grobid_path});
            setTimeout(() => {
                pdf2XML()
            },5000);
        })
        .then(e=> {console.log(1);isServerOn = true; pdf2XML();})

} else {console.log(3);pdf2XML();}

function pdf2XML() {
    execSync(`node main.js -in ${in_folder} -out ${out_folder_XML} ${process_type}`,{cwd: grobid_client_path});
    console.log('Terminou pdf2xml');
    XML2JSON();
}

//converter para json
function XML2JSON() {
    fs.readdirSync(out_folder_XML).forEach(file => {
        const f = file.substring(0,file.lastIndexOf('.'));
        let xml = fs.readFileSync(`${out_folder_XML}/${f}.xml`);
        xml = xml.toString('utf8');
        const json = xmlToJSON.parseString(xml);
        fs.writeFileSync(`${out_folder_JSON}/${f}.json`,JSON.stringify(json));
    });
    console.log('Terminou XML2JSON');
}
//Criar o objeto Pesquisa
/*
* Salvar o título, autores, abstract, palavras-chave, bibliografia
* Salvar isso no objeto pesquisa
* Salva o objeto pesquisa num arquivo.
*
* */
