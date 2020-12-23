// javascript doesn't have a function to remove one element from list...
function remove(arr,ele){
    idx = arr.indexOf(ele)
    arr.splice(idx,1)
    return arr
}

// this function sets up the each page and gets the corresponding comments/entity infos
function set_data(comment_idxs,dataset_idxs){
    cur_idx = $('#page-index').val()

    // main_idx = $('#comment-idx')[0].value
    text = comments[comment_idxs[cur_idx]]
    $('#main-text').html(text)

    // setting the original comment
    $('#original-comment').html(comments[0])

    // emtpying the tables first
    $('#entities-labels').empty()
    $('#info-section').empty()

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
}

$(document).ready(()=>{
    comment_idxs = JSON.parse($('#comment-idx').val())
    dataset_idxs = JSON.parse($('#dataset-idx').val())
    var alph = ['A','B','C','D','E','F']


    // adding the inputs and drag boxes
    for(idx=0;idx<comment_idxs.length;idx++){

        drag = `<div id="drag-container`+idx+`" style="display:none">
                    <div class="drag-container ranking-container">
                        <li class="title">Drag over here to create rankings</li>
                        <ul data-draggable="target" id="base">
                            <ul data-draggable="target" class="one-rank" id="dbox1">
                                <a class="rank-title">#1</a>
                                <a data-draggable="target" class="rank-placeholder">Drop the entities here</a>
                            </ul>
                        </ul>
                    </div>
                    <div class="drag-container no-pref">
                    <li class="title">No Preference</li>
                    <ul class="no-pref-block" data-draggable="target">`
            
        div_string = '<div id="q'+idx+'inputgroup">'
        for(i = 0; i < Object.keys(entity_values).length; i++){
            div_string += '<input id ="q'+idx+'rank'+(i+1)+'" name="q'+idx+'rank'+(i+1)+'" value="[]">'
            drag += '<li class="drag-box" data-draggable="item" draggable="true">Entity '+alph[i]+'</li>'
        }
        div_string += '</div>'
        drag += '</ul></div></div>'
        
        $('#dragboxes').append(drag) 
        
        // create new set of inputs
        
        $('#responses').append(div_string)

    }

    $('#drag-container0').css('display','block')

    $('#continue').on('click',event=>{
        $('#practice').css('display','none')
        $('.one-comment').css('display','block')
        $('#page-index').attr('max',comment_idxs.length)
        $('#page-index').val(0)
        $('#scenario-index').html('1/'+comment_idxs.length)
        $('#prevbtn').prop('disabled',true)
        set_data(comment_idxs,dataset_idxs)

        event.target.style.display = 'none'
    })

    $('#nextbtn').on('click',event=>{
        oldpage = $('#page-index').val()
        $('#page-index').val(oldpage+1)
        $('#drag-container'+oldpage).css('display','none')
        $('#drag-container'+(oldpage+1)).css('display','block')
        $('#scenario-index').html((oldpage+2)+'/'+comment_idxs.length)
        set_data(comment_idxs,dataset_idxs)
        if(oldpage == comment_idxs.length-2){ $(event.target).prop('disabled',true) }
        $('#prevbtn').prop('disabled',false)
    })

    $('#prevbtn').on('click',event=>{
        oldpage = $('#page-index').val()
        $('#page-index').val(oldpage-1)
        $('#drag-container'+oldpage).css('display','none')
        $('#drag-container'+(oldpage-1)).css('display','block')
        $('#scenario-index').html((oldpage)+'/'+comment_idxs.length)
        set_data(comment_idxs,dataset_idxs)
        if(oldpage == 1){ $(event.target).prop('disabled',true) }
        $('#nextbtn').prop('disabled',false)
    })
    
    $('#show-more').on('click',event=>{
        cur_idx = $('#page-index').val()
        main_idx = comment_idxs[cur_idx]

        count = $('#context-container .context-block').length
        next_context = ref_tree[main_idx][count]

        innertext =  '<p class="context-block text-block">'
        innertext += comments[next_context]
        innertext += '</p>'
        $('#context-container').prepend(
            innertext
        )
        
        // check if there is more to show after this. 
        // if not disable the button
        at_end = ref_tree[main_idx][count+1] == null

        if(at_end || count == 9){
            event.target.disabled = true
        }
        $('#show-less').prop('disabled',false)
    })

    $('#show-less').on('click',event=>{
        $('#context-container').children()[0].remove()
        if($('#context-container').children().length == 0){
            // if no more to hide
            event.target.disabled=true
        }
        $('#show-more').prop('disabled',false)
    })

    //dragstart event to initiate mouse dragging
    document.addEventListener('dragstart', function(e)
    {
        dragged = e.target
        draggedfrom = $(e.target).parent().eq(0)
    },false);

    document.addEventListener('dragover', function(e){
        if(e.target){
            e.preventDefault();
        }
    },false);  

    //drop event to allow the element to be dropped into valid targets
    document.addEventListener('drop', function(e){
        if(e.target.getAttribute('data-draggable') == 'target'){
            if(e.target.className == 'rank-placeholder'){
                // if the entity is being placed on to the placeholder
                rank_slot = $(e.target).parent()[0]
                rank_slot.appendChild(dragged)
                e.target.remove()
                update_input(draggedfrom,rank_slot,dragged)
            }else if(e.target.id == 'base'){
                // if the entity is being placed onto 'base' (starting new rank)
                count = $(e.target).children().length+1
                $(e.target).append(
                    `<ul data-draggable="target" class="one-rank" id="dbox`+count+`">
                        <a class="rank-title">#`+count+`</a>
                    </ul>`
                )
                $(e.target).children().last()[0].appendChild(dragged)
                reorder(draggedfrom,e)
                update_input(draggedfrom,e.target,dragged)
            }else{
                reorder(draggedfrom,e)
                update_input(draggedfrom,e.target,dragged)
                e.target.appendChild(dragged);
            }
        }
    },false);


    function reorder(draggedfrom,e){
        cur_idx = $('#page-index').val()
        base = $('#drag-container'+cur_idx +' #base')

        // make sure it doesn't come from No Preference or the same box as dropping
        if( draggedfrom[0].className != 'no-pref-block' 
            && draggedfrom[0].id != e.target.id){
            // length 1 would mean emtpy after it is dragged away
            isempty = 1
            if(e.target.id == 'base'){
                // but for some reason when it is being dropped to 'base', the count is already decremented
                isempty = 0
            }
            
            if(draggedfrom.find('.drag-box').length==isempty){
                draggedfrom.remove()
                if(base.find('.one-rank').length == 0){
                    base.append(
                        `<ul data-draggable="target" class="one-rank" id="dbox1">
                            <a class="rank-title">#1</a>
                            <a data-draggable="target" class="rank-placeholder">Drop the entities here</a>
                        </ul>`
                    )
                }
            }
        }else if(draggedfrom[0].className == 'no-pref-block'){
            // deleting placeholder if new addition
            if(e.target.id == 'base'){
                // delete the whole bar
                placeholder = base.find('.rank-placeholder').parent()
            }else if(e.target.className == 'one-rank'){
                // delete just the placeholder
                placeholder = base.find('.rank-placeholder')
            }
            if(placeholder.length > 0){
                placeholder.remove()
            }
        }

        // fixing names and inputs after deleting
        idx = 1
        for(box of base.find('.one-rank')){
            box.id = 'dbox'+idx
            $(box).find('a')[0].innerHTML = '#'+idx
            idx++
        }
    }

    function update_input(draggedfrom,draggedto,dragged){
        cur_idx = $('#page-index').val()

        // to_inp = $(draggedto).find('input')[0]
        if(draggedto.id == 'base'){
            // to_inp = $(draggedto).children().last().find('input')[0]
            to_idx = $(draggedto).find('.one-rank').length
        }else if(draggedto.className != 'no-pref-block'){
            to_idx = draggedto.id.slice(-1)
        }
        to_inp = $('#q'+cur_idx+'rank'+to_idx)[0]
        
        // creating a new 'rank' in the box
        if(draggedfrom[0].className == 'no-pref-block'){
            vals = JSON.parse(to_inp.value)
            vals.push(dragged.innerHTML)
            to_inp.value = JSON.stringify(vals)
            
            // if going back to No Preference
        }else if(draggedto.className == 'no-pref-block'){
            from_idx = draggedfrom[0].id.slice(-1)
            from_inp = $('#q'+cur_idx+'rank'+from_idx)[0]
            from_vals = JSON.parse(from_inp.value)
            entity = dragged.innerHTML
            new_fromvals = remove(from_vals,entity)
            from_inp.value = JSON.stringify(new_fromvals)
        
        // if going from existing box to another
        }else{
            from_idx = draggedfrom[0].id.slice(-1)
            from_inp = $('#q'+cur_idx+'rank'+from_idx)[0]
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
