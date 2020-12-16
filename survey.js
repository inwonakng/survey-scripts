$(document).ready(()=>{
    // setting the first visible comment
    main_idx = $('#comment-idx')[0].value
    text = comments[main_idx]
    $('#main-text')[0].innerHTML=text

    // creating table to explain entities
    table = document.createElement('table')
    table.className = 'entities'
    header = table.insertRow()
    body = table.insertRow()
    for(ent in entities){
        th = document.createElement('th')
        th.innerHTML=ent
        header.append(th)
        body.insertCell().innerHTML=entities[ent]
    }
    $('#entities-labels').append(table)
    //finished with table here 
    

    // filling out the entity information table
    
    table = document.createElement('table')
    table.className = 'info-table'
    header = table.insertRow()
    header.insertCell()
    
    for(ent in entity_values){
        th = document.createElement('th')
        th.innerHTML=ent
        header.append(th)
    }

    for(param in entity_values[ent]){
        body = table.insertRow()
        body.insertCell().innerHTML=param
        for(ee in entity_values){
            body.insertCell().innerHTML = entity_values[ee][param]
        }
    }

    $('#info-section').append(table)



    $('#show-more').on('click',event=>{
        count = $('#context-container .context-block').length
        next_context = ref_tree[main_idx][count]

        innertext =  '<p class="context-block">'
        innertext += comments[next_context]
        innertext += '</p>'
        $('#context-container').prepend(
            innertext
            // '<p class="context-block">hi lol</p>'
        )
        
        // check if there is more to show after this. 
        // if not disable the button
        at_end = ref_tree[main_idx][count+1] == null
        
        console.log(event.target)

        if(at_end){
            event.target.disabled = true
        }
    })
})
