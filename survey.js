// javascript doesn't have a function to remove one element from list...
function remove(arr,ele){
    idx = arr.indexOf(ele)
    arr.splice(idx,1)
    return arr
}

$(document).ready(()=>{
    // setting the first visible comment
    main_idx = $('#comment-idx')[0].value
    text = comments[main_idx]
    $('#main-text')[0].innerHTML=text

    // setting the original comment
    $('#original-comment')[0].innerHTML = comments[0]

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

        innertext =  '<p class="context-block text-block">'
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

    // setting the initial value here
    lastbox = $('#dragbox').children().last()[0] 
    lastinp = $(lastbox).find('input')[0]
    vals = []
    
    for (i of $(lastbox).find('li.drag-box')){
        vals.push(i.innerHTML)
    }

    lastinp.value = JSON.stringify(vals)

    //dragstart event to initiate mouse dragging
    document.addEventListener('dragstart', function(e)
    {
        dragged = e.target
        inp = $(e.target).parent().find('input')[0]
        vals = JSON.parse(inp.value)
        inp.value = JSON.stringify(remove(vals,e.target.innerHTML))
    },false);

    document.addEventListener('dragover', function(e){
        if(e.target){
            e.preventDefault();
        }
    },false);  

    //drop event to allow the element to be dropped into valid targets
    document.addEventListener('drop', function(e)
    {
        if(e.target.getAttribute('data-draggable') == 'target'){
            e.target.appendChild(dragged);
            inp = $(e.target).find('input')[0]
            vals = JSON.parse(inp.value)
            // console.log('got value',vals)
            vals.push(dragged.innerHTML)
            inp.value = JSON.stringify(vals)
        }
    },false);
})
