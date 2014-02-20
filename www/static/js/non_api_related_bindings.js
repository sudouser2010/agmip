
//----------------------obtains data by right clicking on cluster or point
$( '#map' ).on( "click", '.obtain_data_from_cluster_or_marker', function() 
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


//----------------------------------generate saved_data row from a current data row
function generate_saved_data_row_from_current_data_row(selected_row, current_id)
{
    var local_crid;
    var local_pdate;
    var local_soil_texture;
    var local_institution;
    var local_country;
    var local_exname;
    var local_agmip_rating;
    var local_eid;

    local_crid          = $(selected_row).find("[data-type='crid']").text();
    local_pdate         = $(selected_row).find("[data-type='pdate']").text();
    local_soil_texture  = $(selected_row).find("[data-type='soil']").text();
    local_institution   = $(selected_row).find("[data-type='institution']").text();
    local_country       = $(selected_row).find("[data-type='country']").text();
    local_exname        = $(selected_row).find("[data-type='exname']").text();
    local_agmip_rating  = $(selected_row).find("[data-type='rating']").text();
    local_eid           = $(selected_row).find("[data-type='eid']").text();

    var row     =   "<td data-type='selector'>" + "<span class='saved_data_selector glyphicon glyphicon-remove'></span>" + "</td>";

    row = row + "<td data-type='crid' >"+         local_crid  +"</td>";
    row = row + "<td data-type='pdate' >"+        local_pdate +"</td>";
    row = row + "<td data-type='soil' >"+         local_soil_texture +"</td>";
    row = row + "<td data-type='institution' >"+  local_institution  +"</td>";
    row = row + "<td data-type='country' >"+      local_country  +"</td>";
    row = row + "<td data-type='exname' >"+       local_exname +"</td>";
    row = row + "<td data-type='rating' >"+       local_agmip_rating +"</td>";

    row = "<tr data-id ='"+current_id+"'>"+ row +"</tr>";  

    //appends row after the last row
    $("#saved_data").find("table tr:last").after(row);
}
//----------------------------------generate saved_data row from a current data row




//----------------------actions when user clicks on the current data selector
$( '#current_data' ).on( "click", '.current_data_selector', function() 
{
        var selected_row    = $(this).parent().parent();
        /*
            when the user clicks on the current data selector,
            this function finds the id of the selected row and does the following:
            (a) adds it to the saved data array if it is not there
            (b) removes it from the saved data array if it is there
        */
        //current id represents the eid, the id is stored as data attribute in the row
        var current_id      = selected_row.data('id');
        var index           = saved_data.indexOf(current_id);

        //--------------------------------controls saved_data
        if(index === -1)
        {
            //add eid to array if eid is not in array already
            saved_data.push( current_id );

            //-----------------appends rows to saved table
            generate_saved_data_row_from_current_data_row(selected_row, current_id);
            //-----------------appends rows to saved table     
        }
        else
        {
            //remove eid from array                    
            saved_data.splice(index, 1);
            $("#saved_data").find("[data-id='"+current_id+"']").remove();
        }
        //--------------------------------controls saved_data

        show_hide_saved_data_table();

});
//----------------------actions when user clicks on the current data selector


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

//--------------------------------------------------------when user hits checkbox
$( '#current_data' ).on( "click", '#select_all_current_data', function() 
{

	if( $(this).prop('checked')  )
	{
		select_all_current_data();
		//moves view down to saved data container. Let's user know that something changed
		$('html, body').animate({scrollTop: $("#saved_data_container").offset().top}, 1200);
	}
	else
	{
		deselect_all_current_data();
	}

});
//--------------------------------------------------------when user hits checkbox

//----------------------------------------select all current data
function select_all_current_data()
{
    var rows = $("#current_data table").find("tr");
    var selected_row;
    var current_id;
    var index;
    var name;


    $(rows).each(function(i)
    {

		//the first row is the title for columns, so skip it
        if(i > 0)
        {

            selected_row    = rows[i];
            current_id      = $(selected_row).data('id');

            index           = saved_data.indexOf(current_id);

            if(index === -1)
            {
                $(selected_row).find(".current_data_selector").prop('checked', true);

                //add eid to array if eid is not in array already
                saved_data.push( current_id );

                //-----------------appends rows to saved table
                generate_saved_data_row_from_current_data_row(selected_row, current_id);
                //-----------------appends rows to saved table     
            }

            show_hide_saved_data_table();


        }

    });
	
}
//----------------------------------------select all current data

//--------------------------------deselect all current data
function deselect_all_current_data()
{
	var index_of_eid;
	var local_eid;
	
    for (var i=0; i < current_data.length; i++)
    {
		local_eid 		= current_data[i];
		index_of_eid 	= saved_data.indexOf(local_eid);
		
		//--------------------------------controls saved_data and current data
		if(index_of_eid !== -1)
		{
			//remove this eid from the saved_data array                   
			saved_data.splice(index_of_eid, 1);
			//$(selected_row).remove();
			
			//remove the row from the saved data table
			$("#saved_data").find("[data-id='"+ local_eid +"']").remove();

			//find checkbox in current data remove checkmark
			$("#current_data").find("[data-id='"+local_eid+"']").find('.current_data_selector').prop('checked', false);
		}
		//--------------------------------controls saved_data and current data
			
	}
	
	show_hide_saved_data_table();

}
//--------------------------------deselect all current data



//----------------------------------------remove all current data
function remove_all_current_data()
{
    //this destroys the current_data table
    $("#current_data").find("table").remove();

    $("#select_all_current_data").css("display","none");
    $("#clear_current_data").css("display","none");
    $("#current_data_number").hide();
	$("#current_data").hide();
}
//----------------------------------------remove all current data


//----------------------actions when user clicks on the saved data selector
  $( '#saved_data' ).on( "click", '.saved_data_selector', function() 
    {

            var selected_row    = $(this).parent().parent();
            var current_id      = $(selected_row).data('id');
            var index           = saved_data.indexOf(current_id);

            //--------------------------------controls saved_data
            if(index !== -1)
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

//------------------------clear current data
$( "#clear_current_data" ).click(function() {
	remove_all_current_data();
});
//------------------------clear current data

//---actions when user clicks on the clear saved data button
$( "#clear_saved_data" ).click(function() {

    for (var i=0; i < saved_data.length; i++)
    {
        //removes each row from saved data table
        $("#saved_data").find("[data-id='"+ saved_data[i] +"']").remove();

        //unchecks the corresponding element in the current data table
        $("[data-id='"+ saved_data[i] +"']").find(".current_data_selector").prop('checked', false);

    }


    //this resets the saved data array
    saved_data = [];

    show_hide_saved_data_table();
});
//---actions when user clicks on the clear saved data button



//-----------------------------------------actions when user clicks download data button
$( "#download_data" ).click(function() {
    if( saved_data.length > 0)
    {   
        var database_types  = [];
        var check_boxes     = $(".db_type_filter");

        $(check_boxes).each(function(index) {


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

    if(is_any_check_box_checked === false)
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

