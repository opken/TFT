function main() {
    $.ajax({
        method: 'GET',
        url: '/champions',
        contentType: 'application/json',
    }).done((result) => {
        for (let i of result) {
            createChamp(i.name, i.championId, i.cost, i.traits)
        }
    //    createChamp(result[1].name, result[1].championid, result[1].cost, result[1].traits)
    //    createTraits(result[1].traits)
    })
}


function createChamp(name,id,cost,traits) {
    console.log(id)
    let c = $('<div></div>').addClass('champ').attr('id', name.substring(0,3))
        .append($('<div></div>').addClass('bottom')

            .append($('<div></div>').addClass('name').text(name))
            .append($('<div></div>').addClass('cost').text(cost))
        )
        // .append($('<div></div>').addClass('image')
        //     .css('background-image', 'url(' + '/champions/'+id+'.png' + ')')
        // )
        .append(("<img src='"+ /champions/+id+'.png' + "'></img>"))
        .append($('<div></div>').addClass('traits').attr('id', name.substring(0,3)+'_trait'))

    $('#board').append(c)

    createTraits(name.substring(0,3)+'_trait', traits, name.substring(0,3), cost)

}
function createTraits(trait,traits,name, cost) {
    for (let t of traits) {
        $('#'+trait)
            .append($('<div></div>')
                .append(("<img class='trait_icon' src='"+ /traits/+t.substring(5).toLowerCase()+'.png' + "'></img>"))
                .append($('<span></span>').text(t.substring(5)).addClass('trait_text'))
            )
            // .append(("<img class='trait_icon' src='"+ /traits/+t.substring(5).toLowerCase()+'.png' + "'></img>"))
            // .append($('<span></span>').text(t.substring(5)).addClass('trait_text'))
            // .append($('<br>'))
    }
    if (cost == 1) 
        $('#'+name).css('background-color', 'gray')
    else if (cost == 2 )
        $('#'+name).css('background-color', '#227a31')
    else if (cost == 3 )
        $('#'+name).css('background-color', '#2e84ab')
    else if (cost == 4 )
        $('#'+name).css('background-color', 'purple')
    else if (cost == 5 )
        $('#'+name).css('background-color', '#ffa200')
    
    
   
}