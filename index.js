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

document.getElementById('researchFile').onchange = () => {
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

function networkGraphDrawing(nod,lin) {
    let colors = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select("#keywordSVG")
    var width = +svg.attr("width"),
        height = +svg.attr("height"),
        node,
        link;
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('refX', 13)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 13)
        .attr('markerHeight', 13)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    update(lin,nod);

    function update(links, nodes) {
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link");
            // .attr('marker-end','url(#arrowhead)')
        // link.append("title")
        //     .text(function (d) {return d.type;});

        link
            .on('click', (d) => {console.log(d.type)})
        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attr("class", "edgepath")
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .attr("id", function (d, i) {return 'edgepath' + i},)
            .style("pointer-events", "none");
        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr("class", "edgelabel")
            .attr("id", function (d, i) {return 'edgelabel' + i},)
            .attr("font-size", 10)
            .attr("fill", "#aaa");
        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});
        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                //.on("end", dragended)
            );
        node.append("circle")
            .attr("r", 10)
            .style("fill", function (d, i) {return colors(i);})
        node.append("title")
            .text(function (d) {return d.id;});
        node.append("text")
            .attr("dy", -3)
            .text(function (d) {return d.name});
        simulation
            .nodes(nodes)
            .on("tick", ticked)
        simulation.force("link")
            .links(links);
        node
            .on('click',(d,i) => {console.log(d.name)});
    }
    function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});
        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});
        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });
        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();
                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    }
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
}

function setKW() {networkGraphDrawing(...keywordPreparation())}

document.getElementById('referencesTab').addEventListener('click',() => {changeTab('references')})
document.getElementById('keywordTab'   ).addEventListener('click',() => {changeTab('keyword'   )})
document.getElementById('rawJsonTab'   ).addEventListener('click',() => {changeTab('rawJson'   )})
