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