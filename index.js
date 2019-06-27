
let research = {}

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
// research = {"author":"","arcticles":{"10.1109/CloudCom.2016.0107":{"author":"Y. Demchenko and A. Belloum and W. Los and T. Wiktorski and A. Manieri and H. Brocks and J. Becker and D. Heutelbeck and M. Hemmje and S. Brewer","doi":"10.1109/CloudCom.2016.0107","keywords":["Big Data","computer science education","educational courses","professional aspects","EDISON data science framework","data science profession","multidisciplinary approach","Big Data","data driven technology","educational models","data scientist training","educational courses","harmonized instructional model","data handling lifecycle","data driven research","digital economy","EDSF","data science competence framework","CF-DS","data science body of knowledge","DS-BoK","data science model curriculum","MC-DS","data science professional profiles","DSP profiles","learning outcomes","learning units","knowledge units","ACM classification of computer science","data science curricula","Data science","Data models","Biological system modeling","Training","Business","Industries","Data Science","Data Scientist Professional","Big Data","EDISON Data Science Framework (EDSF)","Data Science Competences Framework (CF-DS)","Data Science Body of Knowledge (DS-BoK)","Data Science Model Curriculum (MC-DS)","Data Science Professional profiles"],"title":"EDISON Data Science Framework: A Foundation for Building Data Science Profession for Research and Industry","publicationYear":"2016","references":["10.1109/CCTES.2018.8674138","10.1109/TVCG.2018.2865145","10.1109/TVCG.2018.2864914"]},"10.1109/BigData.2017.8258190":{"author":"J. S. Saltz and N. W. Grady","doi":"10.1109/BigData.2017.8258190","keywords":["Big Data","national standard Big Data committee efforts","data science teams","data engineer","data scientist","data science roles","standard set","paper reports","data science community","standardized roles","well-defined roles","data science workforce framework","data science team roles","Data science","Big Data","Data models","NIST","big data","data science","project management","data science roles"],"title":"The ambiguity of data science team roles and the need for a data science workforce framework","publicationYear":"2017","references":[]},"10.1109/CCTES.2018.8674138":{"author":"S. Kumar and N. Dhanda and A. Pandey","doi":"10.1109/CCTES.2018.8674138","keywords":["Big Data","data analysis","data mining","data visualisation","Internet","Python","statistical analysis","python language","open source library","Internet information","data set visualization","data set modeling","real time data sheet","data set mining","Big Data analytics","user friendly open source library","statistical analytics expertise field","cosmic infoset mining","data field","statistics methodology","data science","Data visualization","Libraries","Data science","Arrays","Data models","Business","Python","Data science","Pandas","seaborn","Numpy","Data mining","Data Visualization","Data sheet Modeling","Education"],"title":"Data Science — Cosmic Infoset Mining, Modeling and Visualization","publicationYear":"2018","references":["10.1109/TKDE.2019.2903036","10.1109/TIP.2018.2869721","10.1109/BigData.2017.8258190"]},"10.1109/ACCESS.2019.2897217":{"author":"L. Erhan and M. Ndubuaku and E. Ferrara and M. Richardson and D. Sheffield and F. J. Ferguson and P. Brindley and A. Liotta","doi":"10.1109/ACCESS.2019.2897217","keywords":["data analysis","learning (artificial intelligence)","smart cities","smart phones","social sciences","town and country planning","publicly accessible green spaces","data science","machine learning techniques","smart cities","digital technologies","Internet of Things","urban green spaces","photographic information","textual information","location tracking","smartphone app","data analysis","social sciences","Green products","Smart cities","Data science","Tools","Big Data","Global Positioning System","Data analysis","data science","smart cities","social science","urban analytics","urban planning"],"title":"Analyzing Objective and Subjective Data in Social Sciences: Implications for Smart Cities","publicationYear":"2019","references":[]},"10.1109/TSC.2015.2493732":{"author":"W. v. d. Aalst and E. Damiani","doi":"10.1109/TSC.2015.2493732","keywords":["Big Data","cloud computing","data mining","cloud computing","service orientation","process mining","data technology","end-to-end processes","big data initiatives","event data","process science","data science","Data mining","Big data","Computational modeling","Analytical models","Organizations","Process Mining","Data Science","Process Science","Big Data","Service Orientation","Cloud Computing","Process mining","data science","process science","big data","service orientation","and cloud computing"],"title":"Processes Meet Big Data: Connecting Data Science with Process Science","publicationYear":"2015","references":[]},"10.1109/TVCG.2018.2864914":{"author":"H. Song and D. A. Szafir","doi":"10.1109/TVCG.2018.2864914","keywords":["bar charts","data analysis","data visualisation","graph theory","time series","data quality","visualization designers","evaluating visualizations","data collection failures","time series datasets","data analysts perception","line graphs","bar charts","Data visualization","Data integrity","Interpolation","Visualization","Bars","Encoding","Time series analysis","Information Visualization","Graphical Perception","Time Series Data","Data Wrangling","Imputation"],"title":"Where's My Data? Evaluating Visualizations with Missing Data","publicationYear":"2019","references":[]},"10.1109/TVCG.2018.2865145":{"author":"A. Srinivasan and S. M. Drucker and A. Endert and J. Stasko","doi":"10.1109/TVCG.2018.2865145","keywords":["data visualisation","natural language processing","natural language generation","statistical functions","data fact-based visualization search","Voder design","visualization tools","automatically-generated data facts","interactive widgets","system-generated data facts","data density","system-generated sentences","natural language sentences","NLG-based visualization systems","interactive data facts","augmenting visualizations","Data visualization","Tools","Visualization","Natural languages","Data mining","Histograms","Complexity theory","Natural Language Generation","Mixed-initiative Interaction","Visualization Recommendation","Data-driven Communication"],"title":"Augmenting Visualizations with Interactive Data Facts to Facilitate Interpretation and Communication","publicationYear":"2019","references":[]},"10.1109/TKDE.2019.2903036":{"author":"Y. Yao and J. Zhang and F. Shen and L. Liu and F. Zhu and D. Zhang and H. T. Shen","doi":"10.1109/TKDE.2019.2903036","keywords":["Noise measurement","Search engines","Manuals","Visualization","Scalability","Data models","Task analysis","Image dataset construction","multiple textual queries","dataset diversity"],"title":"Towards Automatic Construction of Diverse, High-quality Image Datasets","publicationYear":"2019","references":[]},"10.1109/TIP.2018.2869721":{"author":"Y. Yao and F. Shen and J. Zhang and L. Liu and Z. Tang and L. Shao","doi":"10.1109/TIP.2018.2869721","keywords":["image classification","image enhancement","learning (artificial intelligence)","support vector machines","category classifier","SVM classifiers","data-driven learning","privileged information extraction","classifier learning enhancement","instance-level multiinstance learning model","image selection","subcategory","Noise measurement","Training","Dogs","Visualization","Semantics","Data mining","Robustness","Untagged corpora","classifier learning","privileged information"],"title":"Extracting Privileged Information for Enhancing Classifier Learning","publicationYear":"2019","references":[]},"10.1109/TNNLS.2018.2851612":{"author":"Y. Wu and H. Tan and Y. Li and J. Zhang and X. Chen","doi":"10.1109/TNNLS.2018.2851612","keywords":["gradient methods","matrix decomposition","optimisation","tensors","low-rank priors","diverse characteristics","real-world multiway data","systematic experimental reports","modified CP tensor factorization framework","factorization problem","tensor factor","projected gradient method","simulation data","intelligent transportation systems","GPS data","fused CP factorization method","incomplete tensors","low-rank tensor completion methods","sparsely observed data","multimode structure","model factors","general tensor objects","common method","Nesterov optimal gradient descent method","Tensile stress","Data models","Matrix decomposition","Manifolds","Visualization","Adaptation models","Learning systems","CP factorization","incomplete data analysis","regularizations","tensor completion"],"title":"A Fused CP Factorization Method for Incomplete Tensors","publicationYear":"2019","references":[]}},"hasResearch":true,"mainArcticles":["10.1109/CloudCom.2016.0107","10.1109/BigData.2017.8258190","10.1109/CCTES.2018.8674138","10.1109/ACCESS.2019.2897217","10.1109/TSC.2015.2493732","10.1109/TVCG.2018.2864914","10.1109/TVCG.2018.2865145","10.1109/TKDE.2019.2903036","10.1109/TIP.2018.2869721","10.1109/TNNLS.2018.2851612"]}
research = {"author":"","arcticles":{"10.1109/CloudCom.2016.0107":{"author":"Y. Demchenko and A. Belloum and W. Los and T. Wiktorski and A. Manieri and H. Brocks and J. Becker and D. Heutelbeck and M. Hemmje and S. Brewer","doi":"10.1109/CloudCom.2016.0107","keywords":["Big Data","computer science education","educational courses","professional aspects","EDISON data science framework","data science profession","multidisciplinary approach","Big Data","data driven technology","educational models","data scientist training","educational courses","harmonized instructional model","data handling lifecycle","data driven research","digital economy","EDSF","data science competence framework","CF-DS","data science body of knowledge","DS-BoK","data science model curriculum","MC-DS","data science professional profiles","DSP profiles","learning outcomes","learning units","knowledge units","ACM classification of computer science","data science curricula","Data science","Data models","Biological system modeling","Training","Business","Industries","Data Science","Data Scientist Professional","Big Data","EDISON Data Science Framework (EDSF)","Data Science Competences Framework (CF-DS)","Data Science Body of Knowledge (DS-BoK)","Data Science Model Curriculum (MC-DS)","Data Science Professional profiles"],"title":"EDISON Data Science Framework: A Foundation for Building Data Science Profession for Research and Industry","publicationYear":"2016","references":["10.1109/CCTES.2018.8674138","10.1109/TVCG.2018.2865145","10.1109/TVCG.2018.2864914"]},"10.1109/BigData.2017.8258190":{"author":"J. S. Saltz and N. W. Grady","doi":"10.1109/BigData.2017.8258190","keywords":["Big Data","computer science education","educational courses","professional aspects","EDISON data science framework","data science profession","multidisciplinary approach","Big Data","data driven technology","educational models","data scientist training","educational courses","harmonized instructional model","data handling lifecycle","data driven research","digital economy","EDSF","data science competence framework","CF-DS","data science body of knowledge","DS-BoK","data science model curriculum","MC-DS","data science professional profiles","DSP profiles","learning outcomes","learning units","knowledge units","ACM classification of computer science","data science curricula","Data science","Data models","Biological system modeling","Training","Business","Industries","Data Science","Data Scientist Professional","Big Data","EDISON Data Science Framework (EDSF)","Data Science Competences Framework (CF-DS)","Data Science Body of Knowledge (DS-BoK)","Data Science Model Curriculum (MC-DS)","Data Science Professional profiles"],"title":"The ambiguity of data science team roles and the need for a data science workforce framework","publicationYear":"2017","references":[]},"10.1109/CCTES.2018.8674138":{"author":"S. Kumar and N. Dhanda and A. Pandey","doi":"10.1109/CCTES.2018.8674138","keywords":["Big Data","data analysis","data mining","data visualisation","Internet","Python","statistical analysis","python language","open source library","Internet information","data set visualization","data set modeling","real time data sheet","data set mining","Big Data analytics","user friendly open source library","statistical analytics expertise field","cosmic infoset mining","data field","statistics methodology","data science","Data visualization","Libraries","Data science","Arrays","Data models","Business","Python","Data science","Pandas","seaborn","Numpy","Data mining","Data Visualization","Data sheet Modeling","Education"],"title":"Data Science — Cosmic Infoset Mining, Modeling and Visualization","publicationYear":"2018","references":["10.1109/TKDE.2019.2903036","10.1109/TIP.2018.2869721","10.1109/BigData.2017.8258190"]},"10.1109/ACCESS.2019.2897217":{"author":"L. Erhan and M. Ndubuaku and E. Ferrara and M. Richardson and D. Sheffield and F. J. Ferguson and P. Brindley and A. Liotta","doi":"10.1109/ACCESS.2019.2897217","keywords":["data analysis","learning (artificial intelligence)","smart cities","smart phones","social sciences","town and country planning","publicly accessible green spaces","data science","machine learning techniques","smart cities","digital technologies","Internet of Things","urban green spaces","photographic information","textual information","location tracking","smartphone app","data analysis","social sciences","Green products","Smart cities","Data science","Tools","Big Data","Global Positioning System","Data analysis","data science","smart cities","social science","urban analytics","urban planning"],"title":"Analyzing Objective and Subjective Data in Social Sciences: Implications for Smart Cities","publicationYear":"2019","references":[]},"10.1109/TSC.2015.2493732":{"author":"W. v. d. Aalst and E. Damiani","doi":"10.1109/TSC.2015.2493732","keywords":["Big Data","cloud computing","data mining","cloud computing","service orientation","process mining","data technology","end-to-end processes","big data initiatives","event data","process science","data science","Data mining","Big data","Computational modeling","Analytical models","Organizations","Process Mining","Data Science","Process Science","Big Data","Service Orientation","Cloud Computing","Process mining","data science","process science","big data","service orientation","and cloud computing"],"title":"Processes Meet Big Data: Connecting Data Science with Process Science","publicationYear":"2015","references":[]},"10.1109/TVCG.2018.2864914":{"author":"H. Song and D. A. Szafir","doi":"10.1109/TVCG.2018.2864914","keywords":["bar charts","data analysis","data visualisation","graph theory","time series","data quality","visualization designers","evaluating visualizations","data collection failures","time series datasets","data analysts perception","line graphs","bar charts","Data visualization","Data integrity","Interpolation","Visualization","Bars","Encoding","Time series analysis","Information Visualization","Graphical Perception","Time Series Data","Data Wrangling","Imputation"],"title":"Where's My Data? Evaluating Visualizations with Missing Data","publicationYear":"2019","references":[]},"10.1109/TVCG.2018.2865145":{"author":"A. Srinivasan and S. M. Drucker and A. Endert and J. Stasko","doi":"10.1109/TVCG.2018.2865145","keywords":["data visualisation","natural language processing","natural language generation","statistical functions","data fact-based visualization search","Voder design","visualization tools","automatically-generated data facts","interactive widgets","system-generated data facts","data density","system-generated sentences","natural language sentences","NLG-based visualization systems","interactive data facts","augmenting visualizations","Data visualization","Tools","Visualization","Natural languages","Data mining","Histograms","Complexity theory","Natural Language Generation","Mixed-initiative Interaction","Visualization Recommendation","Data-driven Communication"],"title":"Augmenting Visualizations with Interactive Data Facts to Facilitate Interpretation and Communication","publicationYear":"2019","references":[]},"10.1109/TKDE.2019.2903036":{"author":"Y. Yao and J. Zhang and F. Shen and L. Liu and F. Zhu and D. Zhang and H. T. Shen","doi":"10.1109/TKDE.2019.2903036","keywords":["Noise measurement","Search engines","Manuals","Visualization","Scalability","Data models","Task analysis","Image dataset construction","multiple textual queries","dataset diversity"],"title":"Towards Automatic Construction of Diverse, High-quality Image Datasets","publicationYear":"2019","references":[]},"10.1109/TIP.2018.2869721":{"author":"Y. Yao and F. Shen and J. Zhang and L. Liu and Z. Tang and L. Shao","doi":"10.1109/TIP.2018.2869721","keywords":["image classification","image enhancement","learning (artificial intelligence)","support vector machines","category classifier","SVM classifiers","data-driven learning","privileged information extraction","classifier learning enhancement","instance-level multiinstance learning model","image selection","subcategory","Noise measurement","Training","Dogs","Visualization","Semantics","Data mining","Robustness","Untagged corpora","classifier learning","privileged information"],"title":"Extracting Privileged Information for Enhancing Classifier Learning","publicationYear":"2019","references":[]},"10.1109/TNNLS.2018.2851612":{"author":"Y. Wu and H. Tan and Y. Li and J. Zhang and X. Chen","doi":"10.1109/TNNLS.2018.2851612","keywords":["gradient methods","matrix decomposition","optimisation","tensors","low-rank priors","diverse characteristics","real-world multiway data","systematic experimental reports","modified CP tensor factorization framework","factorization problem","tensor factor","projected gradient method","simulation data","intelligent transportation systems","GPS data","fused CP factorization method","incomplete tensors","low-rank tensor completion methods","sparsely observed data","multimode structure","model factors","general tensor objects","common method","Nesterov optimal gradient descent method","Tensile stress","Data models","Matrix decomposition","Manifolds","Visualization","Adaptation models","Learning systems","CP factorization","incomplete data analysis","regularizations","tensor completion"],"title":"A Fused CP Factorization Method for Incomplete Tensors","publicationYear":"2019","references":[]}},"hasResearch":true,"mainArcticles":["10.1109/CloudCom.2016.0107","10.1109/BigData.2017.8258190","10.1109/CCTES.2018.8674138","10.1109/ACCESS.2019.2897217","10.1109/TSC.2015.2493732","10.1109/TVCG.2018.2864914","10.1109/TVCG.2018.2865145","10.1109/TKDE.2019.2903036","10.1109/TIP.2018.2869721","10.1109/TNNLS.2018.2851612"]}
refreshApp()
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

    const nodeFunc = (d) => {viewArcticle(d.id)}
    const linkFunc = () => {return undefined}
    networkGraphDrawing("#referencesSVG",...referencesPreparation(),nodeFunc,linkFunc, true);
}

function setAuthor() {
    refreshApp();
    currentVizFunction = 'setAuthor';

    const nodeFunc = (d) => {
        const arcticles = research.arcticles
        const rightBar = document.getElementById('rightBar')
        let htmlArcticles = "";
        for (let aut of d.arcticles) { htmlArcticles += `<li onclick="prepViewArcticle(${aut})" >${arcticles[aut].title}</li><hr>` }
        rightBar.innerHTML =
            `<div>
                <h1 class="session-title">Author(s):</h1>  
                <h3><a href="#">${d.name}</a></h3>
                
                <br>
            
                <h1 class="session-title">Arcticles:</h1>
                <ul>
                    ${htmlArcticles}
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
            
                <h1 class="session-title">Common Arcticles(s):</h1>
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