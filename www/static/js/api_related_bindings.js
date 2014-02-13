//--------------------------------------------------------------------------------bindings used for/with api

//------------------obtains data by clicking obtain data button
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
//------------------obtains data by clicking obtain data button

//--------------------------------obtains data by clicking obtain data on pop up
$( '#map' ).on( "click", '.obtain_data_from_cluster_or_marker', function( event ) 
{	
	//obtains data by right clicking on cluster or point
    var geohashes = $(this).data("geohashes"); 
    var eid_count = $(this).data("eid_count"); 
    map.closePopup();

    retrieve_data('none', geohashes, eid_count);

});
//--------------------------------obtains data by clicking obtain data on pop up



$("#map").on("place_markers_and_clusters_on_map", function(event, event_data) 
{

    //only place markers on map if markers are present
    if(event_data['location_data'].length > 0)
    {
        markers = []; //reset the marker array
        place_markers_and_clusters_on_map(event_data['location_data']);
    }  

});

$("#map").on("build_current_data", function(event, event_data) 
{

    build_current_data(event_data['data']); 

});

$("#map").on("prompt_user_for_download", function(event, event_data) 
{
    window.open(event_data['url'] ,"","width=200,height=100");

});
//--------------------------------------------------------------------------------bindings used for/with api






