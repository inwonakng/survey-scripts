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
    // lastbox = $('#dragbox').children().last()[0] 
    // lastinp = $(lastbox).find('input')[0]
    // vals = []
    
    // for (i of $(lastbox).find('li.drag-box')){
    //     vals.push(i.innerHTML)
    // }

    // lastinp.value = JSON.stringify(vals)

    //dragstart event to initiate mouse dragging
    document.addEventListener('dragstart', function(e)
    {
        dragged = e.target
        draggedfrom = $(e.target).parent().eq(0)
        // inp = $(e.target).parent().find('input')[0]
        // vals = JSON.parse(inp.value)
        // inp.value = JSON.stringify(remove(vals,e.target.innerHTML))
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
            // removing placeholder first time
            if(e.target.id == 'base'){
                count = $(e.target).children().length+1
                $(e.target).append(
                    `<ul data-draggable="target" class="one-rank" id="dbox`+count+`">
                        <input name="rank`+count+`" value="[]" class="drag-input">
                        <a class="rank-title">#`+count+`</a>
                    </ul>`
                )
                $(e.target).children().last()[0].appendChild(dragged)
                reorder(draggedfrom,e)
                update_input(draggedfrom,e,dragged)
            }else{
                reorder(draggedfrom,e)
                update_input(draggedfrom,e,dragged)
                e.target.appendChild(dragged);
            }
        // dropping onto the placeholder
        }else if(e.target.className = 'rank-placeholder'){
            container = $(e.target).parent()[0]
            console.log($(e.target).find('.rank-placeholder'))
            $(container).find('.rank-placeholder').eq(0).remove()
            container.appendChild(dragged)

        }
    },false);

    function reorder(draggedfrom,e){
        // make sure it doesn't come from No Preference or the same box as dropping
        if( draggedfrom[0].id != 'no-pref' 
            && draggedfrom[0].id != e.target.id){
            // length 1 would mean emtpy after it is dragged away
            isempty = 1
            if(e.target.id == 'base'){
                // but for some reason when it is being dropped to 'base', the count is already decremented
                isempty = 0
            }
            
            if(draggedfrom.find('.drag-box').length ==isempty){
                draggedfrom.remove()
                // if completely emptied out
                if($('#base').find('.one-rank').length == 0){
                    console.log('cleared!')
                    $('#base').append(
                        `<ul data-draggable="target" class="one-rank" id="dbox1">
                            <input name="rank1" value="[]" class="drag-input">
                            <a class="rank-title">#1</a>
                            <a class="rank-placeholder">Drag and drop over here</a>
                        </ul>`
                    )
                }
            }

            // fixing names and inputs after deleting\
            idx = 1
            for(box of $(e.target).parent().find('.one-rank')){
                box.id = 'dbox'+idx
                $(box).find('a')[0].innerHTML = '#'+idx
                $(box).find('input')[0].name = 'rank'+idx
                idx++
            }
        }

    }

    function update_input(draggedfrom,e,dragged){
        
        to_inp = $(e.target).find('input')[0]
        if(e.target.id == 'base'){
            to_inp = $(e.target).children().last().find('input')[0]
        }
        
        // creating a new 'rank' in the box
        if(draggedfrom[0].id == 'no-pref'){
            vals = JSON.parse(to_inp.value)
            vals.push(dragged.innerHTML)
            to_inp.value = JSON.stringify(vals)
        
        // if going back to No Preference
        }else if(e.target.id == 'no-pref'){
            from_inp = $(draggedfrom[0]).find('input')[0]
            from_vals = JSON.parse(from_inp.value)
            entity = dragged.innerHTML
            new_fromvals = remove(from_vals,entity)
            from_inp.value = JSON.stringify(new_fromvals)
        
        // if going from existing box to another
        }else{
            from_inp = $(draggedfrom[0]).find('input')[0]
            from_vals = JSON.parse(from_inp.value)
            to_vals = JSON.parse(to_inp.value)

            entity = dragged.innerHTML
            new_fromvals = remove(from_vals,entity)
            to_vals.push(entity)

            from_inp.value = JSON.stringify(new_fromvals)
            to_inp.value = JSON.stringify(to_vals)
        }
    }
})
