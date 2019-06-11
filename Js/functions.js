
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

function getReferenceInput(ref) {
    console.log(ref);
    let referencesUl = document.createElement('ul')
    for(let r of ref) {
        const li = document.createElement('li')
        li.addEventListener('click',() => {viewArcticle(r)})
        li.innerHTML = `<a href="#">${r.title}</a>`
        referencesUl.appendChild(li)
    }

    let input = document.createElement('input')
    input.setAttribute('type','text')
    input.setAttribute('id','setReferencesInput')
    input.setAttribute('placeholder','doi1,doi2,doi3...')

    let button = document.createElement('button')
    button.innerText = 'Set References'
    // button.setAttribute('id','setReferencesButton')
    button.addEventListener('click', () => {ref = ref.concat(getBibtexFromDOI(ref))})

    let refInput = document.createElement('div')
    refInput.appendChild(referencesUl)
    refInput.appendChild(document.createElement('br'))
    refInput.appendChild(input)
    refInput.appendChild(document.createElement('br'))
    refInput.appendChild(button)
    return refInput
}

function getBibtexFromDOI(ref) {
    let input = document.getElementById(`setReferencesInput`).value.split(',')
    for (let doi of input) {
        fetch(`http://dx.doi.org/${doi}`, {
            method: 'GET',
            headers:{
                'Accept': 'application/x-bibtex; charset=utf-8'
            }
        }).then(res => res.text())
            .then(response => {
                ref = ref.concat( getDataFromBibtex( BibtexParser( response ) ) )
            })
            .catch(error => console.error('Error:', error) /*Alertar o usuario*/);
    }
}

function getHTMLArcticle(arcticle) {

    let htmlKW = "";
    for (let kw of arcticle.keywords) {htmlKW += `<li>${kw}</li>`}

    let htmlAuthor = "";
    for (let aut of arcticle.author.split(' and ')) {htmlAuthor += `<li>${aut}</li>`}

    let html = document.createElement('div')
    html.innerHTML =
        `
            <h1 class="session-title">Title:</h1>  
                <h3>${arcticle.title}</h3>
                
                <br>
                
                <h1 class="session-title">DOI:</h1>  
                <h3>${arcticle.doi}</h3>
                
                <br>
            
                <h1 class="session-title">Publication Year:</h1>
                <h3>${arcticle.publicationYear}</h3>
                
                <br>
                
                <h1 class="session-title">Keywords:</h1>
                <ul>
                    ${htmlKW}
                </ul>
                
                <br>
            
                <h1 class="session-title">Author(s):</h1>
                <ul>
                    ${htmlAuthor}
                </ul> 
                
                <br>
                
                <h1 class="session-title">Insert References:</h1>
        `

    let refUl = document.createElement('ul')
    refUl.appendChild(getReferenceInput(arcticle.references))
    html.appendChild(refUl)

    return html
}
