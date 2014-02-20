
//---------------------------------------------------------------------------------build table with database data
function build_table_with_data(data)
{
    var table = "";
    var local_rows ="";
    var checked ='';
    var local_crid;
    var local_pdate;
    var local_soil_texture;
    var local_institution;
    var local_country;
    var local_exname;
    var local_agmip_rating;
    var local_eid;
    var index;
    var value;
	var default_unknown = "N/A";

    for (var i=0; i < data.length; i++)
    {
        value               = data[i];
        local_crid          = make_default_when_undefined(value["crid"], default_unknown);
        local_pdate         = make_default_when_undefined(value["pdate"], default_unknown);
        local_soil_texture  = default_unknown;
        local_institution   = make_default_when_undefined(value["institution"], default_unknown);
        local_country       = default_unknown;
        local_exname        = make_default_when_undefined(value["exname"], default_unknown);
        local_agmip_rating  = "unrated";
        local_eid           = make_default_when_undefined(value["eid"], default_unknown);
		current_data.push(local_eid);


        //----------------------------------------------check control
        if(is_in_array( saved_data, local_eid))
        {
            //if this element is already in saved data then make selector checked
            checked = 'checked';
        }
        else
        {
            //if this element is not already in saved data array
            checked = '';
        }
        //----------------------------------------------check control

        local_rows = local_rows + "<td data-type='selector'><input class='current_data_selector' type='checkbox' "+checked+"></td>";
        local_rows = local_rows + "<td data-type='crid' >"+         local_crid  +"</td>";
        local_rows = local_rows + "<td data-type='pdate' >"+        local_pdate +"</td>";
        local_rows = local_rows + "<td data-type='soil' >"+         local_soil_texture +"</td>";
        local_rows = local_rows + "<td class='noWrap' data-type='institution' >"+  local_institution  +"</td>";
        local_rows = local_rows + "<td data-type='country' >"+      local_country  +"</td>";
        local_rows = local_rows + "<td data-type='exname' >"+       local_exname +"</td>";
        local_rows = local_rows + "<td data-type='rating' >"+       local_agmip_rating +"</td>";

        table = table + "<tr data-id ='"+local_eid+"'>"+ local_rows +"</tr>";
        local_rows = "";

    }

    var top_row =	'<tr> \
      					<th class="headerTbl "><input id="select_all_current_data" type="checkbox" ></th> \
      					<th class="headerTbl ">Crop</th> \
      					<th class="headerTbl ">Planting Date</th> \
      					<th class="headerTbl ">Soil Texture</th> \
      					<th class="headerTbl ">Institution</th> \
      					<th class="headerTbl ">Country</th> \
      					<th class="headerTbl ">EXNAME</th> \
      					<th class="headerTbl ">AgMIP Rating</th> \
      				</tr>';


    var table   = "<div class='agmipTable'><table class='table table-striped table-hover noWrap'>" + top_row + table + "</table></div>";
    $("#current_data").html(table);

	//shows current data
	$("#current_data").show();
	
   $("#clear_current_data").show();
   $("#select_all_current_data").show();


    //if the current_data_container is toggled, then un toggle it
    //information on whether the current_data_container is toggled is stored else where
    var toggle_me_element = $("a[data-target='#current_data_container']");

    if(toggle_me_element.hasClass("collapsed")){
        toggle_me_element.removeClass("collapsed");
        $('#current_data_container').collapse('toggle');
    }
    

    //sets the current_data_number
    $('#current_data_number').show();
    $('#current_data_number').find("b").text(data.length);

	//moves view down to current data container. Let's user know that something changed
	$('html, body').animate({scrollTop: $("#current_data_container").offset().top}, 1200);

}
//---------------------------------------------------------------------------------build table with database data

//---------------------------controls visibility of saved table
function show_hide_saved_data_table()
{
    if( saved_data.length > 0)
    {   
		//shows saved data
		$("#saved_data").show();
		
        $(".saved_data_button").show();

        //if the saved_data_container is toggled, then un toggle it
        //information on whether the saved_data_container is toggled is stored else where
        var toggle_me_element = $("a[data-target='#saved_data_container']");

        if(toggle_me_element.hasClass("collapsed")){
            toggle_me_element.removeClass("collapsed");
            $('#saved_data_container').collapse('toggle');
        }
    
        //sets the current_data_number
        $('#saved_data_number').show();
        $('#saved_data_number').text(saved_data.length);

    }
    else
    {
		$("#saved_data").hide();
        $(".saved_data_button").hide();

        $('#saved_data_number').hide();
		$("#select_all_current_data").prop('checked', false);

    }
}
//---------------------------controls visibility of saved table



//----------------------------------------------used to set undefined values to none
function make_default_when_undefined(variable, default_variable)
{
    if(typeof variable === 'undefined')
    {
       return default_variable;
    }
    return variable;
}
//----------------------------------------------used to set undefined values to none
