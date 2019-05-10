
const exec = require('child_process').execSync;
const parser = require('xml2json');
// let json = parser.toJson(xml);
// let xml = parser.toXml(json);

// const grobid_path = ``; //Usa esse para onde está o teu GROBID. Em breve vamos refatorar isso aqui.
const grobid_path = `C:\\Users\\Jairo\\Desktop\\grobid-client`;
let in_folder = "" //Pasta origem dos pdfs
let out_folder = "" //Pasta destino do xml
let process_type = ""; //Qual tipo de processo vai ser feito (total, só as referências etc)
/*
* processFulltextDocument //Processa o documento inteiro
* processHeaderDocument //Retira apenas o cabeçalho
* processReferences //Somente as referências
* OBS: por padrão, é processado o documento inteiro
* */

exec(`cd ${grobid_path}`);
exec(`node main.js -in ${in_folder} -out ${out_folder}`);

//Pegar os arquivos dentro da pasta de xml

//converter para json

//Criar o objeto Pesquisa
/*
* Salvar o título, autores, abstract, palavras-chave, bibliografia
* Salvar isso no objeto pesquisa
* Salva o objeto pesquisa num arquivo.
*
* */
