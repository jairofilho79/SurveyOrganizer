
let research = {}
const backendURI = 'http://127.0.0.1:8080'
//Tabs Changer
let ActiveTab = ['researchConfig'];
function changeTab(ids) {

    for(let act of ActiveTab) {
        const actTab = act+'Tab';
        const actCont = act+'Content';

        document.getElementById(actTab).classList.remove('is-active')
        document.getElementById(actCont).style.display = 'none';
    }

    for(let id of ids) {
        const idTab = id+'Tab';
        const idCont = id+'Content';

        document.getElementById(idTab).classList.add('is-active')
        document.getElementById(idCont).style.display = 'block';
    }

    ActiveTab = [...ids];

    //Toda vez que trocar de aba, a parte direita da tela deve ser limpada.
    document.getElementById('rightBar').innerHTML = '';
}

//Input Style
//https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/

function clearResearch() {
    research = {
        "author": "",
        "arcticles": [],
        "hasResearch": false
    }
}

clearResearch();
refreshResearchView();

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

        const obj = BibtexParser(res);
        bib2research(obj.entries)
        research.hasResearch = true;
        setKeywords();
    };

    reader.readAsText(file);
}

function bib2research(bib) {
    for(let arcticle of bib) {
        const f = arcticle.Fields
        research.arcticles.push({
            "author": f.author,
            "doi": f.doi,
            "keywords": f.keywords.split(', '),
            "title": f.title,
            "publicationYear": f.year,
        })
    }
}

document.getElementById('saveResearchFile').addEventListener('click', () => {
    saveResearch();
    //Alert the user
})

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

//Keywords Visualization
function keywordPreparation() {

    if(Object.keys(research) === 0) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    const arcticles = research.arcticles;
    for(let a=0; a < arcticles.length -1; a++) {
        nodes.push({"name": arcticles[a].title, "id": a});
        for(let art = a+1; art < arcticles.length; art++) {
            const common = arcticles[a].keywords.filter(function(obj) { return arcticles[art].keywords.indexOf(obj) !== -1; });
            if(common.length > 0) {
                links.push({"source": a, "target": art, "type": JSON.stringify(common)})
            }
        }
    };
    nodes.push({"name": arcticles[arcticles.length-1].title, "id": arcticles.length-1});
    return [nodes,links];
}

function networkGraphDrawing(id,nodes,links, nodeFunction, linkFunction) {
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    const drag = simulation => {

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const svg = d3.select(id),
        width = +svg.attr("width"),
        height = +svg.attr("height")

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(function(d) {return 300;}).strength(0.1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 1)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 5)
        .on('click',d => linkFunction(d));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 7)
        .attr("fill", color)
        .call(drag(simulation))
        .on('click',d => nodeFunction(d));

    node.append("title")
        .text(d => d.name);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

function setKeywords() {
    refreshApp();

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
    networkGraphDrawing("#keywordSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setReferences() {
    refreshApp();

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
    networkGraphDrawing("#referencesSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setAuthor() {
    refreshApp();

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
    networkGraphDrawing("#authorSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setPublicationYear() {
    refreshApp();

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
    networkGraphDrawing("#publicationYearSVG",...keywordPreparation(),nodeFunc,linkFunc);
}

function setTaxonomy() {
    refreshApp();

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

//Discart Research
document.getElementById('discartResearch').addEventListener('click', () => {
    clearResearch();
    refreshApp()
    //Alert the user
})

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

//Refresh App
function refreshApp() {
    refreshResearchView()
    d3.select("#referencesSVG").selectAll("*").remove()
    d3.select("#keywordSVG").selectAll("*").remove()
}

//Tabs
document.getElementById('researchConfigTab').addEventListener('click',() => {
    changeTab(['researchConfig']);
    refreshResearchView();
})
document.getElementById('vizTab').addEventListener('click',() => {
    changeTab(['viz']);
})

//VizTabs
document.getElementById('referencesTab').addEventListener('click',() => {
    changeTab(['viz','references']);
    setReferences();
})
document.getElementById('keywordTab').addEventListener('click',() => {
    changeTab(['viz','keyword'])
    setKeywords();
})
document.getElementById('authorTab').addEventListener('click',() => {
    changeTab(['viz','author']);
    setAuthor();

})
document.getElementById('publicationYearTab').addEventListener('click',() => {
    changeTab(['viz','publicationYear']);
    setPublicationYear();
})
document.getElementById('taxonomyTab').addEventListener('click',() => {
    changeTab(['viz','taxonomy']);
    setTaxonomy();
})
