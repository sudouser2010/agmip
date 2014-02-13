
//----------------------obtains data by right clicking on cluster or point
$( '#map' ).on( "click", '.obtain_data_from_cluster_or_marker', function( event ) 
{
    var geohashes = $(this).data("geohashes"); 
    var eid_count = $(this).data("eid_count"); 
    map.closePopup();

    retrieve_data('none', geohashes, eid_count);

});
//----------------------obtains data by right clicking on cluster or point


//-----------------------------------------------apply filter
$( "#apply_filter" ).click(function() 
{
	map.closePopup();
    var crop_id   = $("#crop_filter").val();
    obtain_specific_crop_map_population(crop_id);

});
//-----------------------------------------------apply filter


//--------------------------------------------obtains data by clicking obtain data button
/*
    This function obtains data from database and builds current data table
*/
$( "#obtain_data" ).click(function() {


    var crop_id     = $("#crop_filter").val();
    var geohashes   = [];
    var map_bounds  = map.getBounds();
    var eid_count   = 0;
    var marker;

    //---selects geohashes if marker is within the bounds of view
    for (var i=0; i < markers.length; i++)
    {
        marker = markers[i];
        if( map_bounds.contains([parseFloat(marker['_latlng']["lat"]) ,parseFloat(marker['_latlng']["lng"])]) )
        {                    
            geohashes.push(marker['options']['geohash']);
            eid_count = eid_count + parseFloat(marker['options']['count']);
        }
    }
    //---selects geohashes if marker is within the bounds of view

    //retrieve_data triggers the build table function
    retrieve_data(crop_id, geohashes, eid_count);

});
//--------------------------------------------obtains data by clicking obtain data button




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


//---actions when user clicks on the clear saved data button
$( "#bbbbclear_saved_data" ).click(function() {

    //this resets the saved data array
    vm.saved_data([]);
	
	vm.deselectAllCheckMarks();

    show_hide_saved_data_table();
});
//---actions when user clicks on the clear saved data button



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

