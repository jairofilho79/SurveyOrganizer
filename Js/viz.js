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
                (arcticles[mainArticles[a]].keywords.length
                + arcticles[mainArticles[art]].keywords.length-common.length);
            let r = Math.round(255*(1-ind)).toString(16).toLocaleUpperCase()
            r = r.length === 2 ? r : r+"0"
            const g = "00"
            let b = Math.round(255*ind).toString(16).toLocaleUpperCase()
            b = b.length === 2 ? b : b+"0"

            if(common.length > 0) {
                links.push({"source": mainArticles[a], "target": mainArticles[art], "type": JSON.stringify(common),
                    "strokeColor": "#" + r + g + b})
            }
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

    if(Object.keys(research) === 0) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    const arcticles = research.arcticles;
    const keys = Object.keys(arcticles);

    for (let doi of keys) {
        if(arcticles[doi].references.length === 0) continue;
        nodes.push({"name": arcticles[doi].title, "id": doi});
        for(let reference of arcticles[doi].references) {
            links.push({"source": doi, "target": reference})
        }
    }
    return [nodes,links];
}

/*
*
*Os nós serão os artigos. Os links serão os autores em comum.
* */
function authorPreparation() {

    if(Object.keys(research) === 0) {console.log('You did not start a research yet.'); return;}
    let nodes = []
    let links = []
    const arcticles = research.arcticles;
    for(let a=0; a < arcticles.length -1; a++) {
        nodes.push({"name": arcticles[a].title, "id": a});
        for(let art = a+1; art < arcticles.length; art++) {
            const common = arcticles[a].author.split(' and ').filter(function(obj) { return arcticles[art].author.split(' and ').indexOf(obj) !== -1; });
            const ind = common.length/(arcticles[a].author.split(' and ').length + arcticles[art].author.split(' and ').length-common.length);
            const r = Math.round(255*(1-ind)).toString(16).toLocaleUpperCase()
            const g = "00"
            const b = Math.round(255*ind).toString(16).toLocaleUpperCase()
            if(common.length > 0) {
                links.push({"source": a, "target": art, "type": JSON.stringify(common),
                    "strokeColor": "#" + r + g + b})
            }
        }
    };
    nodes.push({"name": arcticles[arcticles.length-1].title, "id": arcticles.length-1});
    return [nodes,links];
}

/*
*
*Os nós serão os artigos. Os links serão as datas em comum.
* */
function publicationYearPreparation() {

    if(Object.keys(research) === 0) {console.log('You did not start a research yet.'); return;}
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

function networkGraphDrawing(id,nodes,links, nodeFunction, linkFunction, arrow=false) {
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
        height = +svg.attr("height");


    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(function(d) {return currentNetworkGraphLinkDistance;})
            .strength(0.1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("polyline") //Procura o equivalente a isso (line)
        .attr("stroke", d => {return d.strokeColor})
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
        .attr("r", 7)
        .attr("fill", color)
        .call(drag(simulation))
        .on('click',d => nodeFunction(d));


    node.append("title")
        .text(d => d.name);

    simulation.on("tick", () => {
        link.attr("points", function(d) {
            return d.source.x + "," + d.source.y + " " +
                (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
                d.target.x + "," + d.target.y; });

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}


function removeSVGContent() {
    d3.select("#keywordSVG").selectAll("*").remove()
    d3.select("#referencesSVG").selectAll("*").remove()
    d3.select("#authorSVG").selectAll("*").remove()
    d3.select("#publicationYearSVG").selectAll("*").remove()
    d3.select("#taxonomySVG").selectAll("*").remove()
}