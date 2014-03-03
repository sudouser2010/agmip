function make_default_when_undefined(variable, default_variable) {
    if (typeof variable === "undefined") {
        return default_variable;
    }
    return variable;
}

function build_current_data(data) {
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
    vm.current_data([]);
    for (var i = 0; i < data.length; i++) {
        eid = make_default_when_undefined(data[i]["eid"], default_unknown);
        crid = make_default_when_undefined(data[i]["crid"], default_unknown);
        pdate = make_default_when_undefined(data[i]["pdate"], default_unknown);
        soil = make_default_when_undefined(data[i]["soil"], default_unknown);
        institution = make_default_when_undefined(data[i]["institution"], default_unknown);
        country = make_default_when_undefined(data[i]["country"], default_unknown);
        exname = make_default_when_undefined(data[i]["exname"], default_unknown);
        rating = make_default_when_undefined(data[i]["rating"], "unrated");
        if (vm.findIndex(eid, vm.saved_data()) === -1) {
            checked = false;
        } else {
            checked = true;
        }
        vm.current_data.push(new experiment(eid, crid, pdate, soil, institution, country, exname, rating, checked));
    }
    vm.showHideCurrentDataTable();
}

$("#obtain_data").click(function() {
    var crop_id = $("#crop_filter").val();
    var geohashes = [];
    var map_bounds = map.getBounds();
    var eid_count = 0;
    var marker;
    markerLayer.eachLayer(function(marker) {
        if (map_bounds.contains(marker.getLatLng())) {
            geohashes.push(marker.options.geohash);
            eid_count += parseFloat(marker.options.count);
        }
    });
    retrieve_data(crop_id, geohashes, eid_count);
});

$("#map").on("click", ".obtain_data_from_cluster_or_marker", function(event) {
    var geohashes = $(this).data("geohashes");
    var eid_count = $(this).data("eid_count");
    map.closePopup();
    retrieve_data("none", geohashes, eid_count);
});

$("#map").on("place_markers_and_clusters_on_map", function(event, event_data) {
    if (event_data["location_data"].length > 0) {
        markers = [];
        place_markers_and_clusters_on_map(event_data["location_data"]);
    }
});

$("#map").on("build_current_data", function(event, event_data) {
    build_current_data(event_data["data"]);
});

$("#map").on("prompt_user_for_download", function(event, event_data) {
    window.open(event_data["url"], "", "width=200,height=100");
});

$("#apply_filter").click(function() {
    map.closePopup();
    var crop_id = $("#crop_filter").val();
    obtain_specific_crop_map_population(crop_id);
});

$("#download_data").click(function() {
    if (vm.saved_data().length > 0) {
        var database_types = [];
        var check_boxes = $(".db_type_filter");
        var eids_from_saved_data = [];
        $(check_boxes).each(function(index) {
            if ($(check_boxes[index]).prop("checked")) {
                database_types.push($(check_boxes[index]).val());
            }
        });
        eids_from_saved_data = vm.extractEids(vm.saved_data());
        retrieve_database(database_types, eids_from_saved_data);
    }
});

function enable_disable_download_button() {
    var is_any_check_box_checked = false;
    $(".db_type_filter").each(function(index, value) {
        if ($(value).prop("checked")) {
            $("#download_data").prop("disabled", false);
            is_any_check_box_checked = true;
            return false;
        }
    });
    if (is_any_check_box_checked === false) {
        $("#download_data").prop("disabled", true);
    }
}

$(".db_type_filter").click(function() {
    enable_disable_download_button();
});

$("#raise_up_download_modal").click(function() {
    $(".db_type_filter").each(function(index, value) {
        $(value).prop("checked", false);
        $("#download_data").prop("disabled", true);
    });
});

$(".modal").on("show.bs.modal", function() {
    $("body").css("overflow-y", "hidden");
    $(this).css("overflow-y", "hidden");
});

$(".modal").on("hide.bs.modal", function() {
    $("body").css("overflow-y", "auto");
    $(this).css("overflow-y", "auto");
});

var api_url = "http://api.agmip.org/cropsitedb/1";

function obtain_initial_map_population() {
    $("#spinner").modal("show");
    options = {
        type: "GET",
        url: api_url + "/cache/location",
        cache: true,
        dataType: "json"
    };
    $.ajax(options).done(function(result) {
        place_markers_and_clusters_on_map(result);
    }).fail(function(xhr, res) {
        $("#error_message").text("Error: Failed To Populate Map: " + res);
        $("#alertModal").modal("show");
    }).always(function() {
        $("#spinner").modal("hide");
    });
}

function obtain_specific_crop_map_population(crop_type) {
    $("#spinner").modal("show");
    if(crop_type == "none") {
      crop_type = "";
    }
    options = {
        type: "GET",
        url: api_url + "/cache/location/" + crop_type,
        cache: true,
        dataType: "json"
    };
    $.ajax(options).done(function(result) {
        place_markers_and_clusters_on_map(result);
    }).fail(function() {
        $("#error_message").text("Error: Search Operation Has Failed");
        $("#alertModal").modal("show");
    }).always(function() {
        $("#spinner").modal("hide");
    });
}

function retrieve_data(crop_type, geohashes, eid_count) {
    max_eids = 1500;
    if (eid_count > max_eids) {
        $("#error_message").html("Data Size Is Too Large. More Than Data Points " + max_eids + " Selected. <br>Please Specify Data By Using Filter Or By Zooming In.");
        $("#alertModal").modal("show");
    } else {
        $("#spinner").modal("show");
        var packed = {};
        packed.locations = geohashes;
        if(crop_type != "none") {
          packed.crop = crop.type;
        }
        packed = JSON.stringify(packed);
        options = {
            type: "POST",
            url: api_url + "/query/geohash",
            data: packed,
            dataType: "json",
            contentType: "application/json"
        };
        $.ajax(options).done(function(result) {
            build_current_data(result);
        }).fail(function() {
            $("#error_message").text("Error: Failed to Obtain Data");
            $("#alertModal").modal("show");
        }).always(function() {
            $("#spinner").modal("hide");
            vm.selectedAllChecked(false);
        });
    }
}

function retrieve_database(database_types, eids) {
    $("#spinner").modal("show");
    eids = JSON.stringify(eids);
    database_types = JSON.stringify(database_types);
    options = {
        type: "POST",
        url: api_url,
        data: {
            database_types: database_types,
            eids: eids
        },
        cache: true,
        dataType: "json"
    };
    $.ajax(options).done(function(result) {
        $("#map").trigger("prompt_user_for_download", result);
    }).fail(function() {
        $("#error_message").text("Error: Failed to Download Database");
        $("#alertModal").modal("show");
    }).always(function() {
        $("#spinner").modal("hide");
    });
}

var map = render_map_initially();

var markerLayer;

var geojsonLayer;

var markers = [];

var saved_data = [];

var current_data = [];

obtain_initial_map_population();

function render_map_initially() {
    var tile_layer1 = L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg", {
        attribution: "",
        subdomains: "1234"
    });
    var local_map = L.map("map", {
        maxZoom: 13,
        minZoom: 2,
        maxBounds: [ [ -90, -180 ], [ 90, 180 ] ]
    }).setView([ 15, 0 ], 1);
    tile_layer1.addTo(local_map);
    local_map.on("zoomend", function() {
        map.closePopup();
    });
    return local_map;
}

function raise_marker_popup(location, geo_hash, count, marker_popup, map) {
    marker_popup.setLatLng(location).openOn(map).setContent("<b style='color:#bb382b;'>Geohash Point</b> <br><button type='button' data-geohashes='" + JSON.stringify([ geo_hash ]) + "' data-eid_count='" + count + "'class='btn btn-primary borRad obtain_data_from_cluster_or_marker' >Obtain Data</button> <br>has " + count + " experiments");
}

function create_markers_for_map(location_data) {
    var marker_popup = L.popup({
        offset: L.point(0, -32)
    });
    geojsonLayer = L.geoJson(location_data, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                geohash: feature.properties.geohash,
                count: feature.properties.count
            }).on("contextmenu", function(e) {
                raise_marker_popup(e.latlng, this.options.geohash, this.options.count, marker_popup, map);
            });
        }
    });
    if (markerLayer) {
        map.removeLayer(markerLayer);
    }
}

function raise_cluster_popup(location, geo_hashes, eid_count, cluster_popup, map) {
    cluster_popup.setLatLng(location).openOn(map).setContent("<b class='blueTxt'>Cluster of Geohashes</b><br><button type='button' data-geohashes='" + JSON.stringify(geo_hashes) + "' data-eid_count='" + eid_count + "' class='btn btn-primary borRad obtain_data_from_cluster_or_marker'>Obtain Data</button> <br> has " + eid_count + " experiments");
}

function create_clusters_for_map() {
    markerLayer = new L.MarkerClusterGroup();
    markerLayer.addLayer(geojsonLayer);
    var cluster_popup = L.popup({
        offset: L.point(0, -10)
    });
    markerLayer.on("clustercontextmenu", function(event) {
        var markers_in_cluster = event.layer.getAllChildMarkers();
        var geo_hashes = [];
        var eid_count = 0;
        for (var i = 0; i < markers_in_cluster.length; i++) {
            geo_hashes.push(markers_in_cluster[i].options.geohash);
            eid_count = eid_count + parseFloat(markers_in_cluster[i].options.count);
        }
        raise_cluster_popup(event.latlng, geo_hashes, eid_count, cluster_popup, map);
    });
}

function place_markers_and_clusters_on_map(location_data) {
    create_markers_for_map(location_data);
    create_clusters_for_map();
    map.addLayer(markerLayer);
}

ko.observableArray.fn.removeValueAtIndex = function(index) {
    this.valueWillMutate();
    this().splice(index, 1);
    this.valueHasMutated();
};

ko.observableArray.fn.changeValueAtIndex = function(index, value) {
    this.valueWillMutate();
    this()[index] = value;
    this.valueHasMutated();
};

function experiment(eid, crid, pdate, soil, institution, country, exname, rating, checked) {
    var self = this;
    self.eid = eid;
    self.crid = crid;
    self.pdate = pdate;
    self.soil = soil;
    self.institution = institution;
    self.country = country;
    self.exname = exname;
    self.rating = rating;
    self.checked = ko.observable(checked);
}

function all_experiments() {
    var self = this;
    self.current_data = ko.observableArray([]);
    self.saved_data = ko.observableArray([]);
    self.selected_all_checked = ko.observable(false);
    self.updateCheckMark = function(index, value) {
        self.current_data()[index].checked(value);
    };
    self.toggleCheckMark = function(index) {
        self.current_data()[index].checked(!self.current_data()[index].checked());
    };
    self.selectAllCheckMarks = function() {
        for (var i = 0; i < self.current_data().length; i++) {
            current_data_eid = self.current_data()[i]["eid"];
            index = self.findIndex(current_data_eid, self.saved_data());
            self.updateCheckMark(i, true);
            if (index === -1) {
                self.saved_data.push(self.current_data()[i]);
            }
        }
    };
    self.deselectAndRemoveSubsetCheckMarks = function() {
        for (i = 0; i < self.current_data().length; i++) {
            self.updateCheckMark(i, false);
            current_data_eid = self.current_data()[i]["eid"];
            saved_data_index = self.findIndex(current_data_eid, self.saved_data());
            if (saved_data_index !== -1) {
                self.saved_data.removeValueAtIndex(saved_data_index);
            }
        }
    };
    self.deselectAllCheckMarks = function() {
        for (i = 0; i < self.current_data().length; i++) {
            self.updateCheckMark(i, false);
        }
    };
    self.removeAllCurrentData = function() {
        $("#clear_current_data").css("display", "none");
        $("#current_data_number").hide();
        $("#current_data").hide();
        self.current_data([]);
        self.showHideCurrentDataTable();
    };
    self.clearSavedData = function() {
        self.saved_data([]);
        self.deselectAllCheckMarks();
        self.showHideSavedDataTable();
    };
    self.selectAllCurrentDataClicked = function(data, event) {
        if (self.selected_all_checked()) {
            self.selected_all_checked(false);
            self.deselectAndRemoveSubsetCheckMarks();
            self.showHideSavedDataTable();
        } else {
            self.selected_all_checked(true);
            self.selectAllCheckMarks();
            self.showHideSavedDataTable();
            $("html, body").animate({
                scrollTop: $("#saved_data_container").offset().top
            }, 1200);
        }
        return true;
    };
    self.selectorClicked = function(experiment, event) {
        saved_data_index = self.findIndex(experiment["eid"], self.saved_data());
        current_data_index = self.findIndex(experiment["eid"], self.current_data());
        self.toggleCheckMark(current_data_index);
        if (saved_data_index === -1) {
            datum = self.current_data()[current_data_index];
            self.saved_data.push(datum);
        } else {
            self.saved_data.removeValueAtIndex(saved_data_index);
        }
        self.showHideSavedDataTable();
        return true;
    };
    self.removerClicked = function(experiment) {
        saved_data_index = self.findIndex(experiment["eid"], self.saved_data());
        self.saved_data.removeValueAtIndex(saved_data_index);
        current_data_index = self.findIndex(experiment["eid"], self.current_data());
        self.toggleCheckMark(current_data_index);
        self.showHideSavedDataTable();
        return true;
    };
    self.showHideCurrentDataTable = function() {
        if (self.current_data().length > 0) {
            $("#current_data").show();
            $("#clear_current_data").show();
            $("#current_data_number").show();
            $("#current_data_number").find("b").text(self.current_data().length);
            var toggle_me_element = $("a[data-target='#current_data_container']");
            if (toggle_me_element.hasClass("collapsed")) {
                toggle_me_element.removeClass("collapsed");
                $("#current_data_container").collapse("toggle");
            }
            $("html, body").animate({
                scrollTop: $("#current_data_container").offset().top
            }, 1200);
        } else {
            self.selected_all_checked(false);
        }
    };
    self.showHideSavedDataTable = function() {
        if (self.saved_data().length > 0) {
            $("#saved_data").show();
            $(".saved_data_button").show();
            var toggle_me_element = $("a[data-target='#saved_data_container']");
            if (toggle_me_element.hasClass("collapsed")) {
                toggle_me_element.removeClass("collapsed");
                $("#saved_data_container").collapse("toggle");
            }
            $("#saved_data_number").show();
            $("#saved_data_number").text(self.saved_data().length);
        } else {
            $("#saved_data").hide();
            $(".saved_data_button").hide();
            $("#saved_data_number").hide();
            self.selected_all_checked(false);
        }
    };
    self.findIndex = function(eid, array) {
        for (var i = 0; i < array.length; i++) {
            if (eid === array[i]["eid"]) {
                return i;
            }
        }
        return -1;
    };
    self.extractEids = function(array) {
        var eids = [];
        for (i = 0; i < array.length; i++) {
            eids.push(array[i]["eid"]);
        }
        return eids;
    };
}

var vm = new all_experiments();

ko.applyBindings(vm);
