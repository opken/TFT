let champJSONList = []
let currentShop = []
let champsOnBoard = []
let currentTraits = {}
let traitJSONList = []
function getChampJSON() {
    $.ajax({
        method: 'GET',
        url: '/champions',
        contentType: 'application/json',
    }).done((result) => {
        champJSONList = result
        console.log(result)
    })
}
function getTraitJSON() {
    $.ajax({
        method: 'GET',
        url: '/traits',
        contentType: 'application/json',
    }).done((result) => {
        traitJSONList = result
        console.log(traitJSONList)
    })
}
function createShop() {
    $.ajax({
        method: 'GET',
        url: '/shop',   
        contentType: 'application/json',
    }).done((result) => {
        console.log(result)
        currentShop = result
        clearShop()
        for (let i = 0; i < 5; i++) {
            let champInfo = findChampInfo(result[i])
            createChamp(champInfo.name, champInfo.championId, champInfo.cost, champInfo.traits, i)
        }
       
    })
}
function findChampInfo(name) {
    let champ = champJSONList.filter((champ) => {
        return champ.name == name
    })
    return champ[0]
}
function clearShop() {
    $('#champ0').empty();
    $('#champ1').empty();
    $('#champ2').empty();
    $('#champ3').empty();
    $('#champ4').empty();
}
function isEmpty(element) {
    for (let i of element) {
        if (i.innerHTML=="")
            return true
    }
    return false
}
function createBoard() {
    let board = $('#board')
    for (let x = 0; x < 4; x++) {
        let row = $('<div></div>')
        for (let y = 0; y < 7; y++) {
            let boardSpace = $('<div></div>').addClass('hexagon boardSpace')
                .attr('ondrop', 'drop(event)')
                .attr('ondragover', 'allowDrop(event)')

            boardSpace.append($('<div></div>').addClass('hexagonInner'))
            row.append(boardSpace)
        }
        if (x%2==1) {
            row.addClass('oddRow')
        }
        board.append(row)
    }
}
function buy(event) {
    let boughtChamp, content

    if (event.currentTarget.children[0]) {
        boughtChamp = event.currentTarget.children[0].id
        content = {name:boughtChamp} 
        let champPicture = event.currentTarget.getElementsByTagName('img')[0].src
        let bench = $('.bench')
        if (isEmpty(bench)) {
            event.currentTarget.children[0].remove()

        }
        for (let i of bench) {
            if (i.innerHTML == "") {
                let image = new Image()
                image.src = champPicture
                console.log(champPicture)
                image.setAttribute('draggable', 'true')
                image.setAttribute('ondragstart', 'drag(event)')
                image.id = boughtChamp
                i.append(image)
                break
            }
        } 
    }
    $.ajax({
        method: 'POST',
        url: '/buy',
        data: JSON.stringify(content),
        contentType: 'application/json',
    }).done((result) => {
        console.log(result)
    })
}
function getSynergies() {
    let board = document.getElementById('board')
    // console.log(board)
    let champs = board.getElementsByTagName('img')
    for (let c of champs) {
        if (!champsOnBoard.includes(c.id))
            champsOnBoard.push(c.id)
    }
    for (let c of champsOnBoard) {
        let traits = getChampTraits(c)
        for (let t of traits) {
            if (currentTraits[t]) {
                if (!currentTraits[t].includes(c))
                    currentTraits[t].push(c)
            }
            else {
                currentTraits[t] = [c]
            }
        }
    }
    $('#synergies').empty()
    let synergies = document.getElementById('synergies')
    for (let trait in currentTraits) {
        let traitName = trait
        let traitCount = currentTraits[trait].length
        let traitJSONObject = getTraitJSONObject(traitName)
        
        let style;
        for (let i of traitJSONObject.sets) {
            if (traitCount < i.min || i.min ==1) {
                style = i.style
                break
            }
        }
        let iconBg
        if (style == 'bronze') {
            iconBg = 'gray'
        }
        else if (style =='silver') {
            iconBg = '#90c0d1'
        }
        else if (style =='gold') {
            iconBg = 'gold'
        }
        // console.log(traitJSONObject)
        let styleMin = getTraitStyle(traitJSONObject, style).min
        let image = new Image()
        image.src = '/traits/'+traitName.substring(5).toLowerCase()+'.svg'
        image.classList.add('synergies_icon')   
        image.style.backgroundColor = iconBg

        let t = $('<div></div>').addClass('syngergy_container')
            .append(image)
            .append($('<div></div>').addClass("synergy").text(traitName.substring(5))
                .append($('<div></div>').addClass('traitCount').text(traitCount+' / '+styleMin))
        )




        // let a = $('<div></div>').addClass('traits')
        // for (let t of traits) {
        //     a.append($('<div></div>')
        //         .append(("<img class='trait_icon' src='"+ /traits/+t.substring(5).toLowerCase()+'.png' + "'></img>"))
        //         .append($('<span></span>').text(t.substring(5)).addClass('trait_text'))
        //     )
        // }
        $('#synergies').append(t)
    }
    champsOnBoard = []
    currentTraits = []
    // console.log(currentTraits)
}
function getTraitStyle(trait, style) {
    let res = trait.sets.filter((i)=> 
        i.style == style
    )
    return res[0]
}
function getTraitJSONObject(name) {
    let trait = traitJSONList.filter((t)=>
        t.key == name
    )
    return trait[0]
}
function getChampJSONObject(name) {
    let champ = champJSONList.filter((c)=> 
        c.name == name
    )
    return champ[0]
}
function getChampTraits(champ) {
    return getChampJSONObject(champ).traits
}
function createChamp(name,id,cost,traits, champ) {
    let c = $('<div></div>').addClass('champ').attr('id', name)
        .append($('<div></div>').addClass('bottom')

            .append($('<div></div>').addClass('name').text(name))
            .append($('<div></div>').addClass('cost').text(cost))
        )
        .append($('<div></div>').addClass('image')
            .append(("<img src='"+ /champions/+id+'.png' + "'></img>")))

    let a = $('<div></div>').addClass('traits')
    for (let t of traits) {
        a.append($('<div></div>')
            .append(("<img class='trait_icon' src='"+ /traits/+t.substring(5).toLowerCase()+'.png' + "'></img>"))
            .append($('<span></span>').text(t.substring(5)).addClass('trait_text'))
        )
    }
    c.append(a)
    $('#champ'+champ).append(c)

    if (cost == 1) 
        c.css('background-color', 'gray')
    else if (cost == 2 )
        c.css('background-color', '#227a31')
    else if (cost == 3 )
        c.css('background-color', '#2e84ab')
    else if (cost == 4 )
        c.css('background-color', '#aa16ba')
    else if (cost == 5 )
        c.css('background-color', '#ffa200')

    return c

}

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev.target)

}
  
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.append(document.getElementById(data));
    getSynergies();
}
function sell(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let soldChamp = document.getElementById(data).id
    document.getElementById(data).remove()
    console.log(soldChamp)
    console.log(currentTraits)
    getSynergies();
}
