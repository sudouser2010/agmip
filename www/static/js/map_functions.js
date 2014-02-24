//------------------------------------------initialization for map
var map           = render_map_initially();
var markerLayer;
var markers       = [];
var saved_data    = [];
var current_data  = [];

/*
    - markers will be drawn on the markerLayer.
    - the marker array will store all the markers obtained from functions such as:
            obtain_initial_map_population()   and   obtain_specific_crop_map_population()
    - saved data will store the eids on experiments which were selected by the user
*/

/*gets location data and triggers the function
which places markers and clusters on map*/
obtain_initial_map_population();
//------------------------------------------initialization for map



//---------------------------renders map initially
function render_map_initially()
{
    //-------defines tile layers for map
    var tile_layer1 = L.tileLayer( "http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg",
    { attribution : '', subdomains: '1234'});
    //-------defines tile layers for map

    //-------sets map parameters
    var local_map = L.map('map',
        {
        maxZoom: 13,
        minZoom: 2,
        maxBounds:[[-90,-180.0],[90,180.0]], 
        }
    ).setView([15, 0], 1);
    //-------sets map parameters

    //adds tiles to map
    tile_layer1.addTo(local_map);

    //-------------closes pop up after zooming occurs
    local_map.on('zoomend', function() {
        map.closePopup();
    });
    //-------------closes pop up after zooming occurs

    return local_map;
}
//---------------------------renders map initially


//--------------------------------------------------------------------------------------- raising marker popup
function raise_marker_popup(location, geo_hash, count, marker_popup, map)
{
	//this function is used by the create markers function
	raise_popup.setLatLng(location).openOn(map).setContent("<b style='color:#bb382b;'>Geohash Point</b> <br><button type='button' data-geohashes='"+JSON.stringify([geo_hash])+"' data-eid_count='"+ count +"'class='btn btn-primary  borRad obtain_data_from_cluster_or_marker' >Obtain Data</button> <br>has "+ count +' experiments');
}
//--------------------------------------------------------------------------------------- raising marker popup


//-----------------------creates markers and creates pop ups for markers
function create_markers_for_map(location_data)
{
    var local_lat;
    var local_long;
    var local_marker;
    var value;

    //the offset shifts the popup of each marker slightly
    //so that the marker is not being obscured by the popup
    var marker_popup  = L.popup({offset:L.point(0, -32)});
	

			
    for (var i=0; i < location_data.length; i++)
    {
        value        = location_data[i];
        local_lat    = parseFloat(value['lat']);
        local_long   = parseFloat(value['lng']);

        local_marker = L.marker([ local_lat,local_long ], { 'geohash': value['geohash'], 'count': value['count']} );

        //when the user right clicks on each marker, show the following popup
        local_marker.on('contextmenu', function(event)
        {
			raise_marker_popup(event.latlng, this.options.geohash, this.options.count, marker_popup, map);
        });

        markers.push(local_marker);
    }

    
    if (markerLayer) {
        //remove map layer is it already exists
        map.removeLayer(markerLayer);
    }
}
//-----------------------creates markers and creates pop ups for markers

//--------------------------------------------------------------------------------------- raising cluster popup
function raise_cluster_popup(location, geo_hashes, eid_count, cluster_popup, map)
{
	//this function is used by the create clusters function
	cluster_popup.setLatLng(location).openOn(map).setContent("<b class='blueTxt'>Cluster of Geohashes</b><br><button type='button' data-geohashes='"+JSON.stringify(geo_hashes)+"' data-eid_count='"+ eid_count +"' class='btn btn-primary  borRad obtain_data_from_cluster_or_marker'>Obtain Data</button> <br> has "+ eid_count +" experiments");
}
//--------------------------------------------------------------------------------------- raising cluster popup

//----------------------------------------------creates pop ups for clusters
function create_clusters_for_map()
{
    markerLayer = new L.MarkerClusterGroup();
    markerLayer.addLayers(markers);
    //the offset shifts the popup of each cluster slightly
    //so that the marker is not being obscured by the popup
    var cluster_popup = L.popup({offset:L.point(0, -10)});

    //when the user right clicks on each cluster, show the following popup
    markerLayer.on('clustercontextmenu', function (event)
    {

        var markers_in_cluster = event.layer.getAllChildMarkers();
        var geo_hashes = [];
        var eid_count = 0;


        for (var i=0; i < markers_in_cluster.length; i++)
        {
            geo_hashes.push(markers_in_cluster[i].options.geohash);
            eid_count = eid_count + parseFloat(markers_in_cluster[i].options.count);               
        }

		raise_cluster_popup(event.latlng, geo_hashes, eid_count, cluster_popup, map);

     });
}
//----------------------------------------------creates pop ups for clusters


//----------------------------------------------------------------------------------place_markers_and_clusters_on_map
function place_markers_and_clusters_on_map(location_data)
{
    create_markers_for_map(location_data);
    create_clusters_for_map();
    map.addLayer(markerLayer);
}
//----------------------------------------------------------------------------------place_markers_and_clusters_on_map

