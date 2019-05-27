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

//Input Style
//https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/

document.getElementById('openResearchFile').onchange = () => {
    const reader = new FileReader();
    const file = document.getElementById('researchFile').files[0];

    reader.onload = function(){
        const res = reader.result;

        if(Object.keys(research).length !== 0) {
            if(confirm('Are you sure you want to override the current Research?')) {
                research = JSON.parse(res);
            }
        } else {
            research = JSON.parse(res);
        }
        setKW();
    };

    reader.readAsText(file);
}

document.getElementById('pdfFile').onchange = () => {
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

function getResearchFromPDF(folder) {
    fetch(`${backendURI}/getResearchJSON/?folder=${folder}`)
        // .then(response => response.json())
        .then(response => response.text())
        .then(res => {
            console.log(res);
            console.log("Funfou, porra!");
        })
        .catch(e => {
            console.log(e);
        })
}

//https://gist.github.com/fancellu/2c782394602a93921faff74e594d1bb1

function keywordPreparation() {

    /*
    * Links
    *
    * [
        {
            "source": 1,
            "target": 2,
            "type": "KNOWS",
            "since": 2010
        },
        {
            "source": 1,
            "target": 3,
            "type": "FOUNDED"
        },
        {
            "source": 2,
            "target": 3,
            "type": "WORKS_ON"
        },
        {
            "source": 3,
            "target": 4,
            "type": "IS_A"
        }
    ]
    * */
    /*
    * Nodes
    *
    * [
        {
            "name": "Peter",
            "label": "Person",
            "id": 1
        },
        {
            "name": "Michael",
            "label": "Person",
            "id": 2
        },
        {
            "name": "Neo4j",
            "label": "Database",
            "id": 3
        },
        {
            "name": "Graph Database",
            "label": "Database",
            "id": 4
        }
    ]
    * */

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

function networkGraphDrawing(nodes,links) {
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

    const svg = d3.select("#keywordSVG"),
        width = +svg.attr("width"),
        height = +svg.attr("height")

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 1)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 7)
        .attr("fill", color)
        .call(drag(simulation));

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

function setKW() {networkGraphDrawing(...keywordPreparation())}

//Research Dropdown
document.getElementById('researchDropdown').addEventListener('click',() => {
    document.getElementById('researchDropdown').classList.toggle('is-active');
})
document.getElementById('researchDropdown').addEventListener('mouseleave',() => {
    document.getElementById('researchDropdown').classList.remove('is-active');
})

//Tabs
document.getElementById('referencesTab').addEventListener('click',() => {changeTab('references')})
document.getElementById('keywordTab'   ).addEventListener('click',() => {changeTab('keyword'   )})
document.getElementById('rawJsonTab'   ).addEventListener('click',() => {changeTab('rawJson'   )})
