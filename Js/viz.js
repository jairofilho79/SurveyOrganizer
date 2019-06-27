//Keywords Visualization
let currentNetworkGraphLinkDistance = 300;
let currentVizFunction = "";

/*
*
* Os nós são os artigos, os quais contém keywords. Os links são as keywords em comum.
* */
function keywordPreparation() {

    if(!research.hasResearch) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    const arcticles = research.arcticles;
    const mainArticles = research.mainArcticles

    for(let a=0; a < mainArticles.length -1; a++) {
        nodes.push({"name": arcticles[mainArticles[a]].title, "id": mainArticles[a]});
        for(let art = a+1; art < mainArticles.length; art++) {
            const common = arcticles[mainArticles[a]].keywords.filter(function(obj) {
                return arcticles[mainArticles[art]].keywords.indexOf(obj) !== -1;
            });
            const ind = common.length/
                (
                    arcticles[mainArticles[a]].keywords.length
                    + arcticles[mainArticles[art]].keywords.length
                    - common.length
                );
            if(common.length === 0) { continue; }
            links.push({"source": mainArticles[a], "target": mainArticles[art], "type": JSON.stringify(common),
                "distanceValue": Math.round(currentNetworkGraphLinkDistance*(1-ind))})
        }
    };
    nodes.push({"name": arcticles[mainArticles[mainArticles.length-1]].title, "id": mainArticles[mainArticles.length-1]});
    return [nodes,links];
}

/*
*
*Os nós são os artigos. A ideia é mostrar um grafo direcionado de qual artigo referenciou qual. Isto é, há uma seta de um artigo A
*para o artigo B e isso significa que A tem B como referência.
*
* Para isso, deve-se adquirir somente as referências pelo PDF. Entregar os nomes ao usuário. Pedir para que gere um Bibtex e inserir na plataforma.
* Também deve-se permitir que insira o Bibtex sem precisar ler o PDF mais de vez, isto é, salvar na pesquisa.
* Também permitir colocar as referências sem precisar do PDF.
* */
function referencesPreparation() {

    if(!research.hasResearch) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    const arcticles = research.arcticles;
    const keys = Object.keys(arcticles);
    let currentDois = [];

    for (let doi of keys) {
        if(arcticles[doi].references.length === 0) continue;
        if(!currentDois.includes(doi)) {
            nodes.push({"name": arcticles[doi].title, "id": doi});
            currentDois.push(doi);
        }
        for(let reference of arcticles[doi].references) {
            if(!currentDois.includes(reference)) {
                nodes.push({"name": arcticles[reference].title, "id": reference});
                currentDois.push(reference);
            }
            links.push({"source": doi, "target": reference, "strokeColor": "#FF0000"})
        }
    }
    return [nodes,links];
}

/*
*
*Os nós serão os artigos. Os links serão os autores em comum.
* */
function authorPreparation() {

    if(!research.hasResearch) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    let authorLinking = {}
    let authorArcticles = {}
    const arcticles = research.arcticles;
    const mainArticles = research.mainArcticles;
    for (let ma of mainArticles) {
        const authors = arcticles[ma].author.split(' and ')
        authors.forEach(author => {
            authorArcticles[author] = authorArcticles[author] === undefined ?
                [ma] : authorArcticles[author].concat(ma);
            authors.forEach(author2 => {
                try {
                    authorLinking[author2][author]++
                } catch(e) {
                    try {
                        authorLinking[author][author2]++
                    } catch(e) {
                        authorLinking[author] = {}
                        authorLinking[author][author2] = 1
                    }
                }
            })
        })
    }

    for (let a of Object.keys(authorArcticles)) {
        nodes.push({"name": a, "id": a, "arcticles": authorArcticles[a], "size": 7+(authorArcticles[a].length/arcticles.length*7)});
    }
    for(let al of Object.keys(authorLinking)) {
        for(let alInside of Object.keys(authorLinking[al])) {
            links.push({"source": al, "target": alInside,
                "distanceValue": Math.round(currentNetworkGraphLinkDistance*(1-(authorLinking[al][alInside]/arcticles.length)))})
        }

    }
    return [nodes,links];
}

/*
*
*Os nós serão os artigos. Os links serão as datas em comum.
* */
function publicationYearPreparation() {

    if(!research.hasResearch) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    const arcticles = research.arcticles;
    for(let a=0; a < arcticles.length -1; a++) {
        nodes.push({"name": arcticles[a].title, "id": a});
        for(let art = a+1; art < arcticles.length; art++) {
            const common = arcticles[a].publicationYear === arcticles[art].publicationYear ?
                [arcticles[a].title] : [];
            if(common.length > 0) {
                links.push({"source": a, "target": art, "type": JSON.stringify(common)})
            }
        }
    };
    nodes.push({"name": arcticles[arcticles.length-1].title, "id": arcticles.length-1});
    return [nodes,links];
}

/*
*
*O author poderá criar classificações próprias para os artigos. Poder dividí-los a sua maneira e assim enxergá-los.
*Não sei se o Network Graph será a melhor visualização pra isso.
* */
function taxonomyPreparation() {

    if(!research.hasResearch) {console.log('You did not start a research yet.'); return;}
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

function networkGraphDrawing(id,nodes,links, nodeFunction, linkFunction, arrow=false) {
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    const drag = simulation => {

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.005).restart();
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
        height = +svg.attr("height");

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(function(d) {return d.distanceValue ? d.distanceValue : 0;})
            .strength(0.1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("polyline") //Procura o equivalente a isso (line)
        .attr("stroke", d => {return "#FF0000"})
        .attr("stroke-width", 5)
        .attr("stroke-opacity", 1)
        .on('click',d => linkFunction(d));

        if(arrow) {link.attr("marker-mid","url(#arrow)");}
    svg.append("defs")
        .append("marker")
        .attr("id","arrow")
        .attr("markerUnits","strokeWidth")
        .attr("markerWidth","3")
        .attr("markerHeight","3")
        .attr("viewBox","-5 -5 10 10")
        .attr("refX","0")
        .attr("refY","0")
        .attr("orient","auto")
        .append("path")
        .attr("d","M 0,0 m -5,-5 L 5,0 L -5,5 Z")
        .attr("fill", "black");

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => {return d.size ? d.size : 7})
        .attr("fill", color)
        .call(drag(simulation))
        .on('click',d => nodeFunction(d))

    //node.attr("transform", function (d) { return "translate(" + d.x > width ? d.x-width : d.x < 1 ? 1 : 0  + "," + d.y > height ? d.y - height : d.y < 1 ? d.y*-1 > height ? d.y*-1 - height : d.y*-1 : 0 + ")"});;

    node.append("title")
        .text(d => d.name);

    simulation.on("tick", () => {
        link.attr("points", function(d) {
            return d.source.x + "," + d.source.y + " " +
                (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
                d.target.x + "," + d.target.y; });

        node
            .attr("cx", d => {
                d.vx = 0
                return d.x
            })
            .attr("cy", d => {
                d.vy = 0
                return d.y
            });

    });
}

function removeSVGContent() {
    d3.select("#keywordSVG").selectAll("*").remove()
    d3.select("#referencesSVG").selectAll("*").remove()
    d3.select("#authorSVG").selectAll("*").remove()
    d3.select("#publicationYearSVG").selectAll("*").remove()
    d3.select("#taxonomySVG").selectAll("*").remove()
}