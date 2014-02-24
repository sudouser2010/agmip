function obtain_initial_map_population()
{
<<<<<<< HEAD
	$('#spinner').modal('show');
	
=======
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
    options = {
    type:       "GET",
    url:        api_url, 
    data:       { "populate" : "True"},
    cache:      true,
    dataType:   "json",
               }; 

    $.ajax( options)
    .done( function(result)
    {
<<<<<<< HEAD
        //alert(JSON.stringify(result));
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
    }).fail(function()
	{
		$("#error_message").text("Error: Failed To Populate Map");
		$('#alertModal').modal('show');
		
	}).always(function(){
		$('#spinner').modal('hide');
	});
=======
        // alert(JSON.stringify(result));
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
    });
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01


}


function obtain_specific_crop_map_population(crop_type)
{
<<<<<<< HEAD
	$('#spinner').modal('show');
	
=======
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
    options = {
    type:       "GET",
    url:        api_url,
    data:       { "crop_type" : crop_type},
    cache:      true,
    dataType:   "json",
               }; 
<<<<<<< HEAD
	
=======

>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
    $.ajax( options)
    .done( function(result)
    {
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
<<<<<<< HEAD
    }).fail(function()
	{
		$("#error_message").text("Error: Search Operation Has Failed");
		$('#alertModal').modal('show');
		
	}).always(function(){
		$('#spinner').modal('hide');
	});
=======
    });
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01

}


function retrieve_data(crop_type, geohashes, eid_count)
{

    max_eids = 50;
    if( eid_count > max_eids)
<<<<<<< HEAD
    {   
		$("#error_message").html("Data Size Is Too Large. More Than Data Points "+max_eids+" Selected. <br>Please Specify Data By Using Filter Or By Zooming In.");
		$('#alertModal').modal('show');		
    }
    else
    {
	
		$('#spinner').modal('show');
	
=======
    {
        alert("Data Size Is Too Large. More Than Data Points "+max_eids+" Selected.");
        alert("Please specify data by using filter or by zooming in.");       
    }
    else
    {
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
        geohashes = JSON.stringify(geohashes);

        options = {
        type:       "POST",
        url:        api_url,
        data:       { "crop_type": crop_type, "geohashes": geohashes},
        cache:      true,
        dataType:   "json",
                   }; 
<<<<<<< HEAD
				   
=======

>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
        $.ajax( options )
        .done( function(result)
        {
            $("#map").trigger("build_table_with_data", {'data': result });
<<<<<<< HEAD
        }).fail(function()
		{
			$("#error_message").text("Error: Failed to Obtain Data");
			$('#alertModal').modal('show');
			
		}).always(function(){
			$('#spinner').modal('hide');
		});
=======
        });
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
    }


}


function retrieve_database(database_types, eids)
{
<<<<<<< HEAD
	$('#spinner').modal('show');
	
=======

>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
    eids           = JSON.stringify(eids);
    database_types = JSON.stringify(database_types);

    options = {
    type:       "POST",
    url:        api_url,
    data:       { "database_types": database_types, "eids": eids},
    cache:      true,
    dataType:   "json",
               }; 
<<<<<<< HEAD
 
=======

>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01
    $.ajax( options )
    .done( function(result)
    {
        $("#map").trigger("prompt_user_for_download", result );
<<<<<<< HEAD
    }).fail(function()
	{
		$("#error_message").text("Error: Failed to Download Database");
		$('#alertModal').modal('show');
		
	}).always(function(){
		$('#spinner').modal('hide');
	});
=======
    });
>>>>>>> ee8319c23c9c6dd7da35979682747961e03acc01

}



//For testing js code and api
//place the server url here. make sure to append "http://" to the beginning of url 
var api_url = "http://199.231.188.53:60000/api/";  //"http://api.agmip.org/cropdb/1/cache/location",//api_url,

//obtain_initial_map_population();
//obtain_specific_crop_map_population("COT");
//retrieve_data("RIC", ['w4x4mf4','wdw2b1p','wdvcr4h']);
//retrieve_database(["AMCO", "DOME"], ['w4x4mf4','wdw2b1p','wdvcr4h']);







