let research = {}
const backendURI = 'http://127.0.0.1:8080'
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

document.getElementById('researchFile').onchange = () => {
    console.log('oi');
    const reader = new FileReader();
    const file = document.getElementById('researchFile').files[0];

    reader.onload = function(){
        const res = reader.result;

        if(Object.keys(research).length !== 0) {
            if(confirm('Are you sure you want to override the current Research?')) {
                console.log(res);
                research = JSON.parse(res);
            }
        } else {
            console.log(res);
            research = JSON.parse(res);
        }
    };

    reader.readAsText(file);
}

document.getElementById('pdfFile').onchange = () => {
    const xhr = new XMLHttpRequest();

    let files = [...document.getElementById('pdfFile').files];

    let numCurrPDF = 0;
    sendPDFFile();
    function sendPDFFile() {
        const form = new FormData();
        console.log(files[numCurrPDF]);
        xhr.open("POST", `http://127.0.0.1:8080/getReseachFromPDF--${files[numCurrPDF].name.substring(0,files[numCurrPDF].name.lastIndexOf('.'))}` , true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "multipart/form-data");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log(`Foi processado!`);
                if(numCurrPDF === files.length-1) {
                    console.log('terminou tudo!');
                    //Chamar função para concatenar pesquisas.
                } else {
                    numCurrPDF++;
                    sendPDFFile()
                }
            }
        }
        form.append('file',files[numCurrPDF]);
        xhr.send(form);
    }

}


document.getElementById('referencesTab').addEventListener('click',() => {changeTab('references')})
document.getElementById('keywordTab'   ).addEventListener('click',() => {changeTab('keyword'   )})
document.getElementById('rawJsonTab'   ).addEventListener('click',() => {changeTab('rawJson'   )})
