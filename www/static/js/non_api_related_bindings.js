
//-----------------------------------------------apply filter
$( "#apply_filter" ).click(function() 
{
	map.closePopup();
    var crop_id   = $("#crop_filter").val();
    obtain_specific_crop_map_population(crop_id);

});
//-----------------------------------------------apply filter


//----------------------actions when user clicks on the saved data selector
  $( '#saved_data' ).on( "click", '.saved_data_selector', function( event ) 
    {

            var selected_row    = $(this).parent().parent();
            var current_id      = $(selected_row).data('id');
            var index           = saved_data.indexOf(current_id);

            //--------------------------------controls saved_data
            if(index != -1)
            {
                //remove eid from array                    
                saved_data.splice(index, 1); 
                $(selected_row).remove();

                //find checkbox in current data remove checkmark
                $("#current_data").find("[data-id='"+current_id+"']").find('.current_data_selector').prop('checked', false);
            }
            //--------------------------------controls saved_data

            show_hide_saved_data_table();

    });
//----------------------actions when user clicks on the saved data selector


//-----------------------------------------actions when user clicks download data button
$( "#download_data" ).click(function() {
    if( saved_data.length > 0)
    {   
        var database_types  = [];
        var check_boxes     = $(".db_type_filter");

        $(check_boxes).each(function(index, value) {


            //get the value if check box is selected
            if($(check_boxes[index] ).prop('checked'))
            {
                database_types.push($(check_boxes[index]).val());
            }

        });


        retrieve_database(database_types, saved_data);
    }

});
//-----------------------------------------actions when user clicks download data button

//--------------------controls visibility of download button
function enable_disable_download_button()
{

   var is_any_check_box_checked = false;
   $(".db_type_filter").each( function( index, value )
    {
        //if any check box is checked then enabled download button and exit function
        if( $(value).prop("checked") )
        {
            $("#download_data").prop('disabled', false);
            is_any_check_box_checked = true;

            //return false is to break the each loop
            return false;
        }
    });

    if(is_any_check_box_checked == false)
    {
        //if none of the check boxes were checked, then disable download button
        $("#download_data").prop('disabled', true);
    }
    
}
//--------------------controls visibility of download button

//--------------actions when user clicks on check box

$(".db_type_filter").click(function(){
    enable_disable_download_button();
});

//--------------actions when user clicks on check box


//--------------------------------------------------raising up the download modal
$("#raise_up_download_modal").click(function(){

   $(".db_type_filter").each( function( index, value )
    {
        //uncheck all the values
        $(value).prop("checked", false);
        $("#download_data").prop('disabled', true);
    });

});
//--------------------------------------------------raising up the download modal

//---------------------------------------------remove vertical scroll bar for modal
$('.modal').on('show.bs.modal', function() {

	$("body").css("overflow-y","hidden");
	$(this).css("overflow-y","hidden");
});

$('.modal').on('hide.bs.modal', function() {

	$("body").css("overflow-y","auto");
	$(this).css("overflow-y","auto");
});
//---------------------------------------------remove vertical scroll bar for modal

