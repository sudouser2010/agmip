function obtain_initial_map_population()
{
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
        //alert(JSON.stringify(result));
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
    });


}


function obtain_specific_crop_map_population(crop_type)
{
    options = {
    type:       "GET",
    url:        api_url,
    data:       { "crop_type" : crop_type},
    cache:      true,
    dataType:   "json",
               }; 

    $.ajax( options)
    .done( function(result)
    {
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
    });

}


function retrieve_data(crop_type, geohashes, eid_count)
{

    max_eids = 50;
    if( eid_count > max_eids)
    {
        alert("Data Size Is Too Large. More Than Data Points "+max_eids+" Selected.");
        alert("Please specify data by using filter or by zooming in.");       
    }
    else
    {
        geohashes = JSON.stringify(geohashes);

        options = {
        type:       "POST",
        url:        api_url,
        data:       { "crop_type": crop_type, "geohashes": geohashes},
        cache:      true,
        dataType:   "json",
                   }; 

        $.ajax( options )
        .done( function(result)
        {
            $("#map").trigger("build_table_with_data", {'data': result });
        });
    }


}


function retrieve_database(database_types, eids)
{

    eids           = JSON.stringify(eids);
    database_types = JSON.stringify(database_types);

    options = {
    type:       "POST",
    url:        api_url,
    data:       { "database_types": database_types, "eids": eids},
    cache:      true,
    dataType:   "json",
               }; 

    $.ajax( options )
    .done( function(result)
    {
        $("#map").trigger("prompt_user_for_download", result );
    });

}



//For testing js code and api
//place the server url here. make sure to append "http://" to the beginning of url 
var api_url = "http://199.231.188.53:60000/api/";  //"http://api.agmip.org/cropdb/1/cache/location",//api_url,

//obtain_initial_map_population();
//obtain_specific_crop_map_population("COT");
//retrieve_data("RIC", ['w4x4mf4','wdw2b1p','wdvcr4h']);
//retrieve_database(["AMCO", "DOME"], ['w4x4mf4','wdw2b1p','wdvcr4h']);







