
let research = {}
const backendURI = 'http://127.0.0.1:8080'

function clearResearch() {
    research = {
        "author": "",
        "arcticles": {},
        "hasResearch": false,
        "mainArcticles": []
    }
}
clearResearch();
refreshResearchView();
setHeightWidth();

//Refresh App
function refreshApp() {
    refreshResearchView()
    removeSVGContent()
}

//TODO: refatorar!
function setHeightWidth() {
    document.getElementById('app').style.height = "100vh"
    document.getElementById('rightBar').style.height =
        String(window.innerHeight - document.getElementById('labvis').offsetHeight) + "px"
    document.getElementById('rightBar').style.overflowY = "auto"
    // document.getElementById('contentCenterBar').style.height =
    //     String(window.innerHeight - document.getElementById('centerTabs').offsetHeight) + "px"
    document.getElementById('contentCenterBar').style.overflowY = "auto"

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

document.getElementById('bibtexFile').onchange = () => {
    const reader = new FileReader();
    const file = document.getElementById('bibtexFile').files[0];

    reader.onload = function(){
        const res = reader.result;
        const arcticles = getDataFromBibtex(BibtexParser(res));
        research.mainArcticles = research.mainArcticles.concat(Object.keys(arcticles))
        research.arcticles = Object.assign(research.arcticles,arcticles)
        research.hasResearch = true;
        refreshApp();
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
        let c = 0;
        for (let a of research.mainArcticles) {
            liArcticles += `<li onclick="prepViewArcticle(${c})" id="arcticle--${c}"><a href="#arcticle--${c}">${research.arcticles[a].title}</a></li>`
            c++
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
                <h3 onclick="prepViewArcticle(${+d.id})"><a href="#">${arcticle.title}</a></h3>
                
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
                <h3 onclick="prepViewArcticle(${+d.id})"><a href="#">${arcticle.title}</a></h3>
                
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
    networkGraphDrawing("#referencesSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setAuthor() {
    refreshApp();
    currentVizFunction = 'setAuthor';

    const nodeFunc = (d) => {
        const arcticle = research.arcticles[d.id]
        const rightBar = document.getElementById('rightBar')
        let htmlAuthor = "";
        for (let aut of arcticle.author.split(' and ')) {htmlAuthor += `<li>${aut}</li>`}
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Title:</h1>  
                <h3 onclick="prepViewArcticle(${+d.id})"><a href="#">${arcticle.title}</a></h3>
                
                <br>
            
                <h1 class="session-title">Author(s):</h1>
                <ul>
                    ${htmlAuthor}
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

function prepViewArcticle(ind) {
    viewArcticle(research.mainArcticles[ind])
}

function viewArcticle(doi) {
    const rightBar = document.getElementById('rightBar')
    rightBar.innerHTML = ''
    rightBar.appendChild(getHTMLArcticle(doi))
}