
const http = require('http');
const execSync = require('child_process').execSync;
const fs = require('fs');
const { DOMParser } = require('xmldom');
const xmlToJSON = require('xmltojson');
xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(string, 'text/xml');

const slash = process.platform == 'win32' ? '\\' : '/';

let in_folder = `${__dirname}${slash}In` //Pasta origem dos pdfs
let out_folder_XML = `${__dirname}${slash}Out_XML` //Pasta destino do xml
let out_folder_JSON = `${__dirname}${slash}Out_JSON` //Pasta destino do xml
let process_type = ""; //Qual tipo de processo vai ser feito (total, só as referências etc)
/*
* processFulltextDocument //Processa o documento inteiro
* processHeaderDocument //Retira apenas o cabeçalho
* processReferences //Somente as referências
* OBS: por padrão, é processado o documento inteiro
* */

//Refatorado. Agora a pessoa adiciona o grobid pela linha de comando, em qualquer SOe nao fica na propria pasta, fica na pasta temp. Sem dar conflito com o github.
const platformASpath = process.platform === "darwin" || process.platform === "linux" ? "/var/tmp" : process.platform === "win32" ? String(process.env.temp) : false;

let configFile = JSON.parse(fs.readFileSync(`${platformASpath}${slash}config_sorg.json`).toString('utf8'));
const {grobid_path} = configFile;
const {grobid_client_path} = configFile;
if(grobid_client_path === '' || grobid_path === '') {console.log(`Please, set the grobid paths on config.json at: ${platformASpath}${slash}config_sorg.json`); return;}

const server = http.createServer((request, response) => {

    // Set CORS headers
    response.setHeader('Access-Control-Allow-Origin'  , '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods' , '*');
    response.setHeader('Access-Control-Allow-Headers' , '*');

    const url = decodeURIComponent(request.url)

    if(url.includes("/getReseachFromPDF",0)) {
        console.log('Acho que chegaram os arquivos');

        const pdfName = url.substring(url.indexOf('--')+2);
        console.log(pdfName);

        request.once('end', function onEnd () {
            response.statusCode = 200;
            response.end('Uploaded File\n');
        });
        request.pipe(fs.createWriteStream(`./In/${pdfName}.pdf`));
    } else {
        console.log('Deu Bom');
    }
})
server.listen(8080);

function getUrlVars(url) {
    let myJson = {};
    let hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        let hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}

console.log(`Foi ao ligar o servidor!`);

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
* Salvar isso no objeto research
* Salva o objeto research num arquivo.
*
* */
