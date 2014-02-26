//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~table and buttons functions


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


//---------------------------------------------------------------------------------build current data
function build_current_data(data)
{
	var eid;
	var crid;
	var pdate;
	var soil;
	var institution;
	var country;
	var exname;
	var rating;
	var checked;
	var default_unknown = "N/A";
	vm.current_data([]);		//empties observable array

	
    for (var i=0; i < data.length; i++)
    { 
		eid           	= make_default_when_undefined(data[i]["eid"], default_unknown);
        crid          	= make_default_when_undefined(data[i]["crid"], default_unknown);
        pdate         	= make_default_when_undefined(data[i]["pdate"], default_unknown);
        soil  			= make_default_when_undefined(data[i]["soil"], default_unknown);
        institution   	= make_default_when_undefined(data[i]["institution"], default_unknown);
        country     	= make_default_when_undefined(data[i]["country"], default_unknown);
        exname        	= make_default_when_undefined(data[i]["exname"], default_unknown);
        rating  		= make_default_when_undefined(data[i]["rating"], "unrated");

		
		//----if this eid is not in saved data make checkmark false, otherwise make checkmark true
		if( vm.findIndex(eid, vm.saved_data()) === -1)
		{
			checked = false;
		}else{
			checked = true;
		}
		//----if this eid is not in saved data make checkmark false, otherwise make checkmark true
		
		vm.current_data.push(new experiment(eid, crid, pdate, soil, institution, country, exname, rating, checked) ); //add this value to the current_data observable

    }

	vm.showHideCurrentDataTable();
	

}
//---------------------------------------------------------------------------------build current data



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~table and buttons functions




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~api related bindings

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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~api related bindings

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~non api related bindings
//-----------------------------------------------apply filter
$( "#apply_filter" ).click(function()
{
map.closePopup();
    var crop_id = $("#crop_filter").val();
    obtain_specific_crop_map_population(crop_id);

});
//-----------------------------------------------apply filter


//-----------------------------------------actions when user clicks download data button
$( "#download_data" ).click(function() {
    if( vm.saved_data().length > 0)
    {
        var database_types = [];
        var check_boxes = $(".db_type_filter");
var eids_from_saved_data = [];

        $(check_boxes).each(function(index) {


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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~non api related bindings



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~APIs//place the server url here. make sure to append "http://" to the beginning of url 

var api_url = "http://199.231.188.53:60000/api/";  

function obtain_initial_map_population()
{
	$('#spinner').modal('show');
	
    options = {
    type:       "GET",
    url:        api_url, 
    data:       { "populate" : "True"},
    cache:      true,
    dataType:   "json"
               }; 

    $.ajax( options)
    .done( function(result)
    {
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
    }).fail(function()
	{
		$("#error_message").text("Error: Failed To Populate Map");
		$('#alertModal').modal('show');
		
	}).always(function(){
		$('#spinner').modal('hide');
	});


}


function obtain_specific_crop_map_population(crop_type)
{
	$('#spinner').modal('show');
	
    options = {
    type:       "GET",
    url:        api_url,
    data:       { "crop_type" : crop_type},
    cache:      true,
    dataType:   "json"
               }; 
	
    $.ajax( options)
    .done( function(result)
    {
        $("#map").trigger("place_markers_and_clusters_on_map", {'location_data': result});
    }).fail(function()
	{
		$("#error_message").text("Error: Search Operation Has Failed");
		$('#alertModal').modal('show');
		
	}).always(function(){
		$('#spinner').modal('hide');
	});

}


function retrieve_data(crop_type, geohashes, eid_count)
{

    max_eids = 50;
    if( eid_count > max_eids)
    {   
		$("#error_message").html("Data Size Is Too Large. More Than Data Points "+max_eids+" Selected. <br>Please Specify Data By Using Filter Or By Zooming In.");
		$('#alertModal').modal('show');		
    }
    else
    {
	
		$('#spinner').modal('show');
	
        geohashes = JSON.stringify(geohashes);

        options = {
        type:       "POST",
        url:        api_url,
        data:       { "crop_type": crop_type, "geohashes": geohashes},
        cache:      true,
        dataType:   "json"
                   }; 
				   
        $.ajax( options )
        .done( function(result)
        {
            $("#map").trigger("build_current_data", {'data': result });
        }).fail(function()
		{
			$("#error_message").text("Error: Failed to Obtain Data");
			$('#alertModal').modal('show');
			
		}).always(function(){
			$('#spinner').modal('hide');
			vm.selectedAllChecked(false);	//deselect the select all checkmark
		});
    }


}


function retrieve_database(database_types, eids)
{
	$('#spinner').modal('show');
	
    eids           = JSON.stringify(eids);
    database_types = JSON.stringify(database_types);

    options = {
    type:       "POST",
    url:        api_url,
    data:       { "database_types": database_types, "eids": eids},
    cache:      true,
    dataType:   "json"
               }; 
 
    $.ajax( options )
    .done( function(result)
    {
        $("#map").trigger("prompt_user_for_download", result );
    }).fail(function()
	{
		$("#error_message").text("Error: Failed to Download Database");
		$('#alertModal').modal('show');
		
	}).always(function(){
		$('#spinner').modal('hide');
	});

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~APIs




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~map functions

//------------------------------------------initialization for map
var map = render_map_initially();
var markerLayer;
var markers = [];
var saved_data = [];
var current_data = [];

/*
- markers will be drawn on the markerLayer.
- the marker array will store all the markers obtained from functions such as:
obtain_initial_map_population() and obtain_specific_crop_map_population()
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
        maxBounds:[[-90,-180.0],[90,180.0]]
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
marker_popup.setLatLng(location).openOn(map).setContent("<b style='color:#bb382b;'>Geohash Point</b> <br><button type='button' data-geohashes='"+JSON.stringify([geo_hash])+"' data-eid_count='"+ count +"'class='btn btn-primary borRad obtain_data_from_cluster_or_marker' >Obtain Data</button> <br>has "+ count +' experiments');
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
    var marker_popup = L.popup({offset:L.point(0, -32)});

    for (var i=0; i < location_data.length; i++)
    {
        value = location_data[i];
        local_lat = parseFloat(value['lat']);
        local_long = parseFloat(value['lng']);

        local_marker = L.marker([ local_lat,local_long ], { 'geohash': value['geohash'], 'count': value['count']} );

        //when the user right clicks on each makrer, show the following popup
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
cluster_popup.setLatLng(location).openOn(map).setContent("<b class='blueTxt'>Cluster of Geohashes</b><br><button type='button' data-geohashes='"+JSON.stringify(geo_hashes)+"' data-eid_count='"+ eid_count +"' class='btn btn-primary borRad obtain_data_from_cluster_or_marker'>Obtain Data</button> <br> has "+ eid_count +" experiments");
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~map functions





//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~agmip knockout

//-----------------------------for extra knockout array functionality
ko.observableArray.fn.removeValueAtIndex = function(index) 
{
	this.valueWillMutate();
	this().splice(index, 1);
	this.valueHasMutated();
}	

ko.observableArray.fn.changeValueAtIndex = function(index,value) 
{
	this.valueWillMutate();
	this()[index] = value;
	this.valueHasMutated();
}		
//-----------------------------for extra knockout array functionality


function experiment(eid, crid, pdate, soil, institution, country, exname, rating, checked) 
{

	var self = this;

	self.eid			= eid;			
	self.crid			= crid;
	self.pdate			= pdate;
	self.soil			= soil;
	self.institution	= institution;
	self.country		= country;
	self.exname			= exname;
	self.rating			= rating;
	self.checked		= ko.observable(checked);

}


function all_experiments() {
	var self = this;
	
	self.current_data 			= ko.observableArray([]);
	self.saved_data 			= ko.observableArray([]);		
	self.selected_all_checked 	= ko.observable(false);	
		
	//--------------updates checkmark in checkbox on current data table
	self.updateCheckMark = function(index, value) 
	{	
		//function assigns a value to the check mark
		self.current_data()[index].checked(value);
	}
	//--------------updates checkmark in checkbox on current data table

	//-----------------------toggles checkmark
	self.toggleCheckMark = function(index) 
	{
		//function reverses the boolean value of the checkmark
		self.current_data()[index].checked( !self.current_data()[index].checked() );
	}
	//-----------------------toggles checkmark
	
	
	
	//------------------------------------------when user checkbox on current data table to select all
	self.selectAllCheckMarks = function() 
	{
		for( var i=0; i < self.current_data().length; i++)
		{
			current_data_eid = self.current_data()[i]["eid"];
			index = self.findIndex(current_data_eid, self.saved_data());
			self.updateCheckMark(i, true);	

			if(index === -1)
			{
				//the current_data eid is not in the array then push it into saved_data
				self.saved_data.push( self.current_data()[i] );
			}			
		}
	}	
	//------------------------------------------when user checkbox on current data table to select all
	
	
	//------------------------------------------when user checkbox on current data table to deselect all
	self.deselectAndRemoveSubsetCheckMarks = function() 
	{
		/*
			Overview: code deselects (and removes) elements which are in the intersection of 
			the current_data elements and the saved_data elements
			
			Code does the following:
			(1) loop through current data
			(2) unchecks the checkmark of each current data
			(3) obtains eid of each current data
			(4) gets index of datum (called saved data index) associated with that particular eid in the saved data array
			
			(5a) If the the saved_data_index is -1, then the datum associated with that eid is not in the saved data array
			(5a) run showHideSavedDataTable code
			
			(5b) If the the saved_data_index is not -1, then the datum associated with that eid is in the saved data array
			(6b) use saved_data_index to remove the datum associated with that particular index from the saved data array
		*/

		for( i=0; i< self.current_data().length; i++ )
		{
					
			self.updateCheckMark(i, false);												
			current_data_eid = self.current_data()[i]["eid"];							
			saved_data_index = self.findIndex(current_data_eid, self.saved_data());
			
			if(saved_data_index !== -1)
			{
				//remove element from saved data array
				self.saved_data.removeValueAtIndex(saved_data_index);		
			}
		}
			
	}
	//------------------------------------------when user checkbox on current data table to deselect all	

	
	//---------------------------when user hits the x icon at the top of the on saved data table
	//this method is used by the clearSavedData method
	self.deselectAllCheckMarks = function() 
	{
		//function loops through all checkmarks and sets them to false
		for( i=0; i< self.current_data().length; i++ )
		{
			self.updateCheckMark(i, false);
		}
		
	}			
	//---------------------------when user hits the x icon at the top of the on saved data table
	
	//---------------------------when user hits clear on current data table
	self.removeAllCurrentData = function()
	{
		$("#clear_current_data").css("display","none");
		$("#current_data_number").hide();
		$("#current_data").hide();
		
		self.current_data([]);				//empties the array
		
		self.showHideCurrentDataTable();
	}
	//---------------------------when user hits clear on current data table
	
	//---------------------------when user hits the x icon at the top of the on saved data table
	self.clearSavedData = function()
	{
		self.saved_data([]);
		
		self.deselectAllCheckMarks();

		self.showHideSavedDataTable();		
	}
	//---------------------------when user hits the x icon at the top of the on saved data table		
		

	//-------------------------------------------clicked on select all for current data table
	self.selectAllCurrentDataClicked = function(data, event)
	{	
	
		if(self.selected_all_checked())
		{
			//this is when de-selection is occurring
			self.selected_all_checked(false);
			
			self.deselectAndRemoveSubsetCheckMarks();
			
			self.showHideSavedDataTable();
			
		}else{
			//this is when selection is occurring			
			self.selected_all_checked(true);
			self.selectAllCheckMarks();
			self.showHideSavedDataTable();
			
			//moves view down to saved data container. Let's user know that something changed
			$('html, body').animate({scrollTop: $("#saved_data_container").offset().top}, 1200);

		}	
		
		return true;	//returns true so the checkbox will function correctly
	}
	//-------------------------------------------clicked on select all for current data table

	//------------------------------------------------------clicked on a selector (checkbox) for current data table	
	self.selectorClicked = function(experiment, event) 
	{	
		/*
			(1) Code uses eid to get the saved_data_index
			(2) Code uses the eid to find the current_data_index
			(3) Code toggles the checkbox
			
			(4a) If saved_data_index is -1, then the datum associated with the eid is not in the saved_data array
			(5a) Code uses the index to get the corresponding datum for the eid
			(6a) And pushes that datum into the saved_data array
			
			
			(4a) Code uses the index to get the corresponding datum for the eid
			(5a) And pushes that datum into the saved_data array
			(6a) Code checks checkbox to show element is selected
			(7a) run showHideSavedDataTable
			
			(4b) If saved_data_index is not -1, then the datum associated with the eid is in the saved_data_array
			(5b) code uses the saved_data_index to remove the datum for that corresponding eid from the saved_data 
			(6b) run showHideSavedDataTable
		*/
		
		saved_data_index = self.findIndex( experiment["eid"] , self.saved_data());			//(1)
		current_data_index = self.findIndex( experiment["eid"] , self.current_data());		//(2)
		

		self.toggleCheckMark(current_data_index);											//(3)
		if( saved_data_index === -1)		//(4a)
		{
			datum = self.current_data()[current_data_index];								//(5a)
			self.saved_data.push(datum);													//(6a)	
		}
		else{	//(4b)
			self.saved_data.removeValueAtIndex(saved_data_index);							//(5b)					
		}
		
		self.showHideSavedDataTable();													//(7a) and (6b)
		
		return true;																	//returns true so the checkbox will function correctly
	}
	//------------------------------------------------------clicked on a selector (checkbox) for current data table	

	//-----------------------------clicked on a remover (x - icon) for saved data table	
	
	self.removerClicked = function(experiment)
	{
		/*
			(1) Code uses eid to get the saved_data_index
			(2) Code uses the saved_data_index to remove the datum for that corresponding eid from the saved_data 
			(3) Code finds the current_data_index
			(4) Code uses current_data_index to remove the checkmark from the corresponding data in the current_data table by toggling it
			(5) Run showHideSavedDataTable
		*/
		
		saved_data_index = self.findIndex( experiment["eid"] , self.saved_data());			//(1)		
		self.saved_data.removeValueAtIndex(saved_data_index);								//(2)						
		current_data_index = self.findIndex( experiment["eid"] , self.current_data());		//(3)			
		self.toggleCheckMark(current_data_index);											//(4)			
		
		self.showHideSavedDataTable();														//(5)
		return true;
	}
	//-----------------------------clicked on a remover (x - icon) for saved data table			
	
	//---------------------------controls visibility of current table
	self.showHideCurrentDataTable = function()
	{
	
		if( self.current_data().length > 0)
		{
			//shows current data
			$("#current_data").show();	
			$("#clear_current_data").show();

			//sets the current_data_number
			$('#current_data_number').show();
			$('#current_data_number').find("b").text(self.current_data().length);

			//if the current_data_container is toggled, then un toggle it
			//information on whether the current_data_container is toggled is stored else where
			var toggle_me_element = $("a[data-target='#current_data_container']");

			if(toggle_me_element.hasClass("collapsed")){
				toggle_me_element.removeClass("collapsed");
				$('#current_data_container').collapse('toggle');
				}
			
			//moves view down to current data container. Let's user know that something changed
			$('html, body').animate({scrollTop: $("#current_data_container").offset().top}, 1200);
		}
		else
		{
			self.selected_all_checked(false);
		}
	}
	//---------------------------controls visibility of current table
	
	//---------------------------controls visibility of saved table
	self.showHideSavedDataTable = function()
	{
		if( self.saved_data().length > 0)
		{   
			//shows saved data
			$("#saved_data").show();
			
			$(".saved_data_button").show();

			//if the saved_data_container is toggled, then untoggle it
			//information on whether the saved_data_container is toggled is stored else where
			var toggle_me_element = $("a[data-target='#saved_data_container']");

			if(toggle_me_element.hasClass("collapsed")){
				toggle_me_element.removeClass("collapsed");
				$('#saved_data_container').collapse('toggle');
			}
		
			//sets the current_data_number
			$('#saved_data_number').show();
			$('#saved_data_number').text(self.saved_data().length);

		}
		else
		{
			$("#saved_data").hide();
			$(".saved_data_button").hide();

			$('#saved_data_number').hide();
			self.selected_all_checked(false);
		}
	}
	//---------------------------controls visibility of saved table

	
	//-----------------------------------------------------------find index of eid
	self.findIndex = function(eid, array)
	{
		//array returns index of eid or -1 (if eid is not in array)
		//assumption: the eid and array[i]["eid"] are both strings
		
		for( var i=0; i < array.length; i++)
		{
			if(eid === array[i]["eid"])
			{
				return i;
			}
		}
		return -1;

	}
	//-----------------------------------------------------------find index of eid
	
	
	//-----------------------------------------extract eids 
	self.extractEids = function(array)
	{
		/*
			This functions returns an array of all eids in either 
			the current_data_array or the saved_data array. 
			This is used to help format the data sent to the server for 
			downloading databases
		*/
		
		var eids = []
		for( i=0; i< array.length; i++ )
		{
			eids.push(array[i]["eid"]);
		}
		
		return eids;
	}
	//-----------------------------------------extract eids 

}


var vm = new all_experiments();
	
ko.applyBindings(vm);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~agmip knockout







