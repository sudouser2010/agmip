
//-----------------------------------------------apply filter
$( "#apply_filter" ).click(function() 
{
	map.closePopup();
    var crop_id   = $("#crop_filter").val();
    obtain_specific_crop_map_population(crop_id);

});
//-----------------------------------------------apply filter


//-----------------------------------------actions when user clicks download data button
$( "#download_data" ).click(function() {
    if( vm.saved_data().length > 0)
    {   
        var database_types  = [];
        var check_boxes     = $(".db_type_filter");
		var eids_from_saved_data = [];

        $(check_boxes).each(function(index, value) {


            //get the value if check box is selected
            if($(check_boxes[index] ).prop('checked'))
            {
                database_types.push($(check_boxes[index]).val());
            }

        });

		eids_from_saved_data = vm.extractEids( vm.saved_data() );
        retrieve_database(database_types, eids_from_saved_data );
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

