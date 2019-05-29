
const http = require('http');
const execSync = require('child_process').execSync;
const fs = require('fs');
const { DOMParser } = require('xmldom');
const xmlToJSON = require('xmltojson');
const rimraf = require("rimraf");
xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(string, 'text/xml');

const slash = process.platform == 'win32' ? '\\' : '/';

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

    if(url.includes("/setPDF",0)) {
        // /setPDF--pdfname__foldername
        const pdfName = url.substring(url.indexOf('--')+2,url.indexOf('__'));
        let folderName;
        if(url.substring(url.indexOf('__')+2) == "") {
            folderName = getFolderName();
            while(fs.existsSync(`${__dirname}${slash}${folderName}${slash}`)) {folderName = getFolderName()}
            fs.mkdirSync(`${__dirname}${slash}${folderName}${slash}`);
        } else {
            folderName = url.substring(url.indexOf('__')+2)
        }
        console.log(pdfName);

        request.once('end', function onEnd () {
            response.statusCode = 200;
            response.end(folderName);
        });

        request.pipe(fs.createWriteStream(`./${folderName}/${pdfName}.pdf`));
    } else if(url.includes("/getResearchJSON",0)) {

        const params = getUrlVars(url);
        const folder = params['folder'];
        const folderPath = `${__dirname}${slash}${folder}${slash}`;

        if(fs.existsSync(folderPath)) {

            const outXML = `${__dirname}${slash}${folder+'_XML'}${slash}`;
            const outJSON = `${__dirname}${slash}${folder+'_JSON'}${slash}`;

            if(!fs.existsSync(outXML))  fs.mkdirSync(outXML);
            if(!fs.existsSync(outJSON)) fs.mkdirSync(outJSON);

            pdf2XML(folderPath,outXML);
            XML2JSON(outXML,outJSON);

            //Criar arquivo de pesquisa;

            const arcticles = getResearchFromJSON(outJSON);

            rimraf.sync(folderPath);
            rimraf.sync(outXML);
            rimraf.sync(outJSON);

            response.statusCode = 200;
            response.end(JSON.stringify(arcticles));

        } else {response.statusCode = 404; response.end("The directory given was not found.");}


    } else {
        console.log('Nada a ser feito');
    }
})
server.listen(8080);

function getFolderName() {
    const numbers = (new Date()).getTime().toString().match(/.{1,2}/g);
    let numbersOk = [];

    for(let num of numbers) {
        if((num >= 48 && num <= 57) || (num >= 65 && num <= 90) ||(num >= 97 && num <= 128)) {
            numbersOk.push(num)
        } else {
            switch((new Date()).getTime().toString()%3) {
                case 0: numbersOk.push(String(Math.round(Math.random()*9)  + 48)); break;
                case 1: numbersOk.push(String(Math.round(Math.random()*25) + 65)); break;
                case 2: numbersOk.push(String(Math.round(Math.random()*25) + 97)); break;
            }
        }
    }
    return String.fromCharCode(...numbersOk);
}

function getResearchFromJSON(json_folder) {
    let all_arcticles = []
    fs.readdirSync(json_folder).forEach(file => {
        const json_file = json_folder+file
        let researchJSON = {}
        const json = JSON.parse(fs.readFileSync(json_file, "utf8"));

// Título* - Outro jeito de acessar o título --------------------------------------------------------------------------//
        try {
            researchJSON['title'] = json.TEI[0].teiHeader[0].fileDesc[0].sourceDesc[0].biblStruct[0].analytic[0].title[0]._text;
        }
        catch(err) {
            console.log(err)
            researchJSON['title'] = undefined
        }

// Data da Publicação -------------------------------------------------------------------------------------------------//
        try {
            researchJSON['publicationDate'] = json.TEI[0].teiHeader[0].fileDesc[0].publicationStmt[0].date[0]._text;
        }
        catch(err) {
            console.log(err)
            researchJSON['publicationDate'] = undefined
        }


// Autores ------------------------------------------------------------------------------------------------------------//
        try {
            const authors = json.TEI[0].teiHeader[0].fileDesc[0].sourceDesc[0].biblStruct[0].analytic[0].author;
            researchJSON['authors'] = []
            for(let author of authors) {
                researchJSON['authors'].push({
                    "forename": author.persName[0].forename? author.persName[0].forename[0]._text : "",
                    "surname": author.persName[0].surname ? author.persName[0].surname[0]._text : ""
                });
            }
        }
        catch(err) {
            console.log(err)
            researchJSON['authors'] = undefined
        }

// DOI ----------------------------------------------------------------------------------------------------------------//
        try {
            researchJSON['doi'] = json.TEI[0].teiHeader[0].fileDesc[0].sourceDesc[0].biblStruct[0].idno[0]._text;
        }
        catch(err) {
            console.log(err)
            researchJSON['doi'] = undefined
        }

// Keyword ------------------------------------------------------------------------------------------------------------//

        try {
            researchJSON['keywords'] = [];

            const terms = json.TEI[0].teiHeader[0].profileDesc[0].textClass[0].keywords[0].term;
            for(let l = 0; l< terms.length; l++) {
                researchJSON['keywords'].push(terms[l]._text);
            }
        }
        catch(err) {
            console.log(err)
            researchJSON['keywords'] = undefined
        }


// Abstract -----------------------------------------------------------------------------------------------------------//

        try {
            const div = json.TEI[0].teiHeader[0].profileDesc[0].abstract[0].div[0]
            if(div.hasOwnProperty('head')){
                researchJSON['abstract'] = div.head[0]._text
            }else{
                researchJSON['abstract'] = div.p[0]._text
            }
        }
        catch(err) {
            console.log(err);
            researchJSON['abstract'] = ''
        }

// Bibliografia -------------------------------------------------------------------------------------------------------//
        let indice;
        for(let d in json.TEI[0].text[0].back[0].div) {
            if(json.TEI[0].text[0].back[0].div[d].hasOwnProperty('listBibl')) {
                indice = +d;
            }
        }
        const bibleStruct = json.TEI[0].text[0].back[0].div[indice].listBibl[0].biblStruct;

        researchJSON['references'] = []

        for(let bl of bibleStruct) {
            try{
                let getInfo;
                if(bl.hasOwnProperty('analytic')) {
                    getInfo = bl.analytic[0]
                }else {
                    getInfo = bl.monogr[0]
                }
                if(getInfo.title[0]._text == null) continue

                let reference = {};

                const authors = getInfo.author;
                let jsonAuthors = []

                for(let author of authors) {
                    jsonAuthors.push({
                        "forename": author.persName[0].forename? author.persName[0].forename[0]._text : "",
                        "surname": author.persName[0].surname ? author.persName[0].surname[0]._text : ""
                    })
                }

                reference['title'] = getInfo.title[0]._text;
                reference['authors'] = jsonAuthors
                reference['publication'] = bl.monogr[0].title[0]._text
                reference['publicationYear'] = bl.monogr[0].imprint[0].date[0]._attr.when._value

                researchJSON['references'].push(reference)

            }catch(err){
                console.log(err)
            }
        }
        all_arcticles.push(researchJSON);
    })
    return all_arcticles;
}

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

function pdf2XML(in_folder,out_folder_XML, process_type="") {

    execSync(`node main.js -in ${in_folder} -out ${out_folder_XML} ${process_type}`,{cwd: grobid_client_path});
    console.log('Terminou pdf2xml');
}

//converter para json
function XML2JSON(out_folder_XML,out_folder_JSON) {

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
