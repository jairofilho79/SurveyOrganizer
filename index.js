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

//https://gist.github.com/fancellu/2c782394602a93921faff74e594d1bb1
function sovai() {

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
    update([
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
    ], [
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
    ]);
    function update(links, nodes) {
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)')
        link.append("title")
            .text(function (d) {return d.type;});
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
            .attr("r", 5)
            .style("fill", function (d, i) {return colors(i);})
        node.append("title")
            .text(function (d) {return d.id;});
        node.append("text")
            .attr("dy", -3)
            .text(function (d) {return d.name+":"+d.label;});
        simulation
            .nodes(nodes)
            .on("tick", ticked);
        simulation.force("link")
            .links(links);
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
//    function dragended(d) {
//        if (!d3.event.active) simulation.alphaTarget(0);
//        d.fx = undefined;
//        d.fy = undefined;
//    }

}
sovai();

function keywordPreparation() {
    if(Object.keys(research) === 0) {console.log('You did not start a research yet.'); return;}
    let arcticleInd = 0;
    let nodes = []
    let links = []
    let findingLinks = {};
    research.arcticles.forEach(arcticle => {
        nodes.push({"name": arcticle.title, "group": arcticleInd});
        arcticle.keywords.forEach(keyword => {
            if(findingLinks[keyword] === undefined) findingLinks[keyword] = [];
            findingLinks[keyword].push(arcticleInd);
        })
        arcticleInd++;
    });

    let keys = Object.keys(findingLinks);
    for(let key = 0; key < keys.length; key++) {
        for(let i=0; i < keys[key].length; i++) {
            for(let j = i+1; j < keys[key].length; j++) {
                links.push({"source": keys[key][i], "target": keys[key][j], "value": 1});
            }
        }
    }

    return [nodes,links];
}

function keywordDrawing(nod,lin) {
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let force = d3.forceLink()
        .charge(-180)
        .linkDistance(70)
        // .size([width, height]);

    let svg = d3.select("#keywordSVG");

    force
        .nodes(nod)
        .links(lin)
        .start();

    let links = svg.append("g").selectAll("line.link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .attr("marker-end", "url(#arrow)");

    let nodes = svg.selectAll("circle.node")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    nodes.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
        links.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
}

function setKW() {keywordDrawing(...keywordPreparation())}

document.getElementById('referencesTab').addEventListener('click',() => {changeTab('references')})
document.getElementById('keywordTab'   ).addEventListener('click',() => {changeTab('keyword'   )})
document.getElementById('rawJsonTab'   ).addEventListener('click',() => {changeTab('rawJson'   )})
