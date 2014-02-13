

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
		if( vm.find_index(eid, vm.saved_data()) == -1)
		{
			checked = false;
		}else{
			checked = true
		}
		//----if this eid is not in saved data make checkmark false, otherwise make checkmark true
		
		vm.current_data.push(new experiment(eid, crid, pdate, soil, institution, country, exname, rating, checked) ); //add this value to the current_data observable

    }

	vm.show_hide_current_data_table();
	

}
//---------------------------------------------------------------------------------build current data






