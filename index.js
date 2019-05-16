//Tabs Changer
let ActiveTab = 'references';
function changeTab(id) {
    const idTab = id+'Tab';
    const actTab = ActiveTab+'Tab';
    const idCont = id+'Content';
    const actCont = ActiveTab+'Content';

    document.getElementById(actTab).classList.remove('is-active')
    document.getElementById(idTab).classList.add('is-active')

    document.getElementById(actCont).style.display = 'none';
    document.getElementById(idCont).style.display = 'block';

    ActiveTab = id;
}
document.getElementById('referencesTab').addEventListener('click',() => {changeTab('references')})
document.getElementById('keywordTab'   ).addEventListener('click',() => {changeTab('keyword'   )})
document.getElementById('rawJsonTab'   ).addEventListener('click',() => {changeTab('rawJson'   )})