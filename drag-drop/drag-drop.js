$(document).ready(()=>{
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
        cur_idx = 'Sample'
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
        cur_idx = 'Sample'

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