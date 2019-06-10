
let research = {}
const backendURI = 'http://127.0.0.1:8080'

function clearResearch() {
    research = {
        "author": "",
        "arcticles": [],
        "hasResearch": false
    }
}
clearResearch();
refreshResearchView();

//Refresh App
function refreshApp() {
    refreshResearchView()
    removeSVGContent()
}

//--------------------------------------LEFT SIDE-----------------------------------------
document.getElementById('openResearchFile').onchange = () => {
    const reader = new FileReader();
    const file = document.getElementById('openResearchFile').files[0];

    reader.onload = function(){
        const res = reader.result;

        if(Object.keys(research).length !== 0) {
            if(!confirm('Are you sure you want to override the current Research?')) {return;}
        }
        research = JSON.parse(res);
        research.hasResearch = true;
        setKeywords();
    };

    reader.readAsText(file);
}

document.getElementById('pdfFile').onchange = () => {
    document.getElementById('pdfLoadingIcon').style.display = 'block'
    if(Object.keys(research).length === 0) {
        newResearchFormSetup('none','block')
    }
    const xhr = new XMLHttpRequest();

    let files = [...document.getElementById('pdfFile').files];

    let numCurrPDF = 0;
    let foldername = ""
    sendPDFFile();
    function sendPDFFile() {
        const form = new FormData();
        xhr.open("POST", `${backendURI}/setPDF--${files[numCurrPDF].name.substring(0,files[numCurrPDF].name.lastIndexOf('.'))}__${foldername}` , true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "multipart/form-data");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

                if(numCurrPDF === files.length-1) {
                    console.log('terminaram os envios!');
                    getResearchFromPDF(xhr.responseText)
                    //Chamar função para concatenar pesquisas.
                } else {
                    console.log(`Foi processado um pdf!`);
                    foldername = xhr.responseText;
                    numCurrPDF++;
                    sendPDFFile()
                }
            }
        }
        form.append('file',files[numCurrPDF]);
        xhr.send(form);
    }

}

document.getElementById('bibtexFile').onchange = () => {
    const reader = new FileReader();
    const file = document.getElementById('bibtexFile').files[0];

    reader.onload = function(){
        const res = reader.result;

        research.arcticles = research.arcticles
                                .concat(getDataFromBibtex(BibtexParser(res)))
        research.hasResearch = true;
        setKeywords();
    };

    reader.readAsText(file);
}

document.getElementById('saveResearchFile').addEventListener('click', () => {
    saveResearch();
    //Alert the user
})

//Research Dropdown
document.getElementById('researchDropdown').addEventListener('click',() => {
    document.getElementById('researchDropdown').classList.toggle('is-active');
});
document.getElementById('researchDropdown').addEventListener('mouseleave',() => {
    document.getElementById('researchDropdown').classList.remove('is-active');
});

//NewResearch
document.getElementById('newResearch').addEventListener('click',() => {
    newResearchFormSetup('none','block')
})
document.getElementById('createNewResearch').addEventListener('click',() => {
    const ids = ['newResearchTitle','newResearchFullname','newResearchEmail','newResearchOrganization','newResearchMotivation'];
    const isEmpty = isEmptyInput(ids)
    if(!isEmpty) {
        let inputData = getDataFromForm(ids);
        research['title'] = inputData['newResearchTitle'];
        research['author'] = inputData['newResearchFullname'];
        research['authorEmail'] = inputData['newResearchEmail'];
        research['authorOrganization'] = inputData['newResearchOrganization'];
        research['authorMotivation'] = inputData['newResearchMotivation'];
        const date = new Date();
        research['creationDate'] = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
        newResearchFormSetup('block','none');
        research.hasResearch = true;
        //Mensagem de concluído com sucesso!
    } else {
        document.getElementById(isEmpty).focus(); return;
    }
})

//Discart Research
document.getElementById('discartResearch').addEventListener('click', () => {
    clearResearch();
    refreshApp()
    //Alert the user
})

//--------------------------------------CENTER SIDE----------------------------------------

//JSON research visualization
function refreshResearchView() {
    const content = document.getElementById('researchConfigContent');
    if(research.hasResearch) {
        let liArcticles = ``;
        for (let a in research.arcticles) {
            liArcticles += `<li id="arcticle--${+a}">${research.arcticles[a].title}</li>    `
        }
        content.innerHTML =
            `
                <h1 class="session-title">Research title</h1>
                    <div id="researchViewTitle">${research.title}</div>
                <h1 class="session-title">Research author</h1>
                    <div id="researchViewAuthor">${research.author}</div>
                <h1 class="session-title">Research Author's e-mail address</h1>
                    <div id="researchViewAuthorEmail">${research.authorEmail}</div>
                <h1 class="session-title">Research Author's motivation</h1>
                    <div id="researchViewAuthorMotivation">${research.authorMotivation}</div>
                <h1 class="session-title">Research Articles</h1>
                    <div id="researchViewArcticles"><ul>${liArcticles}</ul></div>
            `
    } else {
        content.innerText = "There's no Research file yet."
    }
}

//Visualizations
function setKeywords() {
    refreshApp();
    currentVizFunction = 'setKeywords';

    const nodeFunc = (d) => {
        const arcticle = research.arcticles[d.id]
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of arcticle.keywords) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Title:</h1>  
                <h3>${arcticle.title}</h3>
                
                <br>
            
                <h1 class="session-title">Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul>
                
                <br>
                
                <h1>Insert References:</h1>
                <ul>
                    ${getReferenceInput(d.id)}
                </ul>
            </div>
            `
    }
    const linkFunc = (d) => {
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of JSON.parse(d.type)) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Linked Nodes:</h1>  
                <h3>${d.source.name} <br> <hr>${d.target.name}</h3>
                
                <br>
            
                <h1 class="session-title">Common Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul> 
            </div>
            `
    }
    networkGraphDrawing("#keywordSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setReferences() {
    refreshApp();
    currentVizFunction = 'setReferences';

    const nodeFunc = (d) => {
        const arcticle = research.arcticles[d.id]
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of arcticle.keywords) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Title:</h1>  
                <h3>${arcticle.title}</h3>
                
                <br>
            
                <h1 class="session-title">Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul>
                
                <br>
                
                <h1>Insert References:</h1>
                <ul>
                    ${getReferenceInput(d.id)}
                </ul>
            </div>
            `
    }
    const linkFunc = (d) => {
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of JSON.parse(d.type)) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Linked Nodes:</h1>  
                <h3>${d.source.name} <br> <hr>${d.target.name}</h3>
                
                <br>
            
                <h1 class="session-title">Common Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul> 
            </div>
            `
    }
    networkGraphDrawing("#referencesSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setAuthor() {
    refreshApp();
    currentVizFunction = 'setAuthor';

    const nodeFunc = (d) => {
        const arcticle = research.arcticles[d.id]
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of arcticle.author.split(' and ')) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Title:</h1>  
                <h3>${arcticle.title}</h3>
                
                <br>
            
                <h1 class="session-title">Author(s):</h1>
                <ul>
                    ${htmlKW}
                </ul> 
            </div>
            `
    }
    const linkFunc = (d) => {
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of JSON.parse(d.type)) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Linked Nodes:</h1>  
                <h3>${d.source.name} <br> <hr>${d.target.name}</h3>
                
                <br>
            
                <h1 class="session-title">Common Author(s):</h1>
                <ul>
                    ${htmlKW}
                </ul> 
            </div>
            `
    }
    networkGraphDrawing("#authorSVG",...authorPreparation(),nodeFunc,linkFunc);
}

function setPublicationYear() {
    refreshApp();
    currentVizFunction = 'setPublicationYear';

    const nodeFunc = (d) => {
        const arcticle = research.arcticles[d.id]
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of arcticle.publicationYear) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Title:</h1>  
                <h3>${arcticle.title}</h3>
                
                <br>
                
                <h1 class="session-title">DOI:</h1>  
                <h3>${arcticle.doi}</h3>
                
                <br>
            
                <h1 class="session-title">Publication Year:</h1>
                <h3>${arcticle.publicationYear}</h3>
                
                <br>
                
                <h1>Insert References:</h1>
                <ul>
                    ${getReferenceInput(d.id)}
                </ul>
                
            </div>
            `
    }
    const linkFunc = (d) => {
        const rightBar = document.getElementById('rightBar')
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Linked Nodes:</h1>  
                <h3>${d.source.name} <br> <hr>${d.target.name}</h3>
                
                <br>
            
                <h1 class="session-title">Common Year:</h1>
                <ul>
                    ${research.arcticles[d.id].publicationYear}
                </ul> 
            </div>
            `
    }
    networkGraphDrawing("#publicationYearSVG",...publicationYearPreparation(),nodeFunc,linkFunc);
}

function setTaxonomy() {
    refreshApp();
    currentVizFunction = 'setTaxonomy';

    const nodeFunc = (d) => {
        const arcticle = research.arcticles[d.id]
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of arcticle.keywords) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Title:</h1>  
                <h3>${arcticle.title}</h3>
                
                <br>
            
                <h1 class="session-title">Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul> 
            </div>
            `
    }
    const linkFunc = (d) => {
        const rightBar = document.getElementById('rightBar')
        let htmlKW = "";
        for (let kw of JSON.parse(d.type)) {htmlKW += `<li>${kw}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Linked Nodes:</h1>  
                <h3>${d.source.name} <br> <hr>${d.target.name}</h3>
                
                <br>
            
                <h1 class="session-title">Common Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul> 
            </div>
            `
    }
    networkGraphDrawing("#taxonomySVG",...keywordPreparation(),nodeFunc,linkFunc);
}

//--------------------------------------RIGHT SIDE-----------------------------------------

//---------------------------------------FUNCTION------------------------------------------

function getDataFromBibtex(bib) {
    let objs = []
    for(let arcticle of bib.entries) {
        const f = arcticle.Fields
        objs.push({
            "author": f.author ? f.author : "",
            "doi": f.doi ? f.doi : "",
            "keywords": f.keywords ? f.keywords.split(', ') : "",
            "title": f.title ? f.title : "",
            "publicationYear": f.year ? f.year : "",
            "references": []
        })
    }
    return objs
}

function saveResearch() {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(research)));
    element.setAttribute('download', 'myResearch.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function getResearchFromPDF(folder) {
    fetch(`${backendURI}/getResearchJSON/?folder=${folder}`)
        // .then(response => response.json())
        .then(response => response.text())
        .then(res => {
            if(!research.hasOwnProperty('arcticles')) research.arcticles = []
            research.arcticles = research.arcticles.concat(JSON.parse(res));
            console.log(res);
            document.getElementById('pdfLoadingIcon').style.display = 'none'
        })
        .catch(e => {
            console.log(e);
            document.getElementById('pdfLoadingIcon').style.display = 'none'
        })
}

function newResearchFormSetup(displayCurrent,displayNewResearch) {
    document.getElementById('referencesTab').style.display = displayCurrent;
    document.getElementById('referencesContent').style.display = 'none';
    document.getElementById('keywordTab').style.display = displayCurrent;
    document.getElementById('keywordContent').style.display = 'none';
    document.getElementById('researchConfigTab').style.display = displayCurrent;
    document.getElementById('researchConfigContent').style.display = 'none';
    document.getElementById(ActiveTab+'Content').style.display = displayCurrent;

    document.getElementById('newResearchTab').style.display = displayNewResearch;
    document.getElementById('newResearchTab').classList.toggle('is-active');
    document.getElementById('newResearchContent').style.display = displayNewResearch;
}

function getDataFromForm(ids) {
    let data = {}
    for (let id of ids) {
        data[id] = document.getElementById(id).value
        document.getElementById(id).value = ''
    }
    return data
}

function isEmptyInput(ids) {
    for (let id of ids) {
        if(document.getElementById(id).value === '') return id;
    }
    return false;
}

function getReferenceInput(index) {
    return `<input type="text" id="setReferencesInput" placeholder="doi1,doi2,doi3..."/>
            <br><button onclick="getBibtexFromDOI(${index})">Set References</button>`
}

function getBibtexFromDOI(ind) {
    let input = document.getElementById(`setReferencesInput`).value.split(',')
    for (let doi of input) {
        fetch(`http://dx.doi.org/${doi}`, {
            method: 'GET',
            headers:{
                'Accept': 'application/x-bibtex; charset=utf-8'
            }
        }).then(res => res.text())
            .then(response => {
                research.arcticles[ind]
                    .references = research.arcticles[ind]
                                    .references.concat(getDataFromBibtex((BibtexParser(response))))
            })
            .catch(error => console.error('Error:', error) /*Alertar o usuario*/);
    }
}