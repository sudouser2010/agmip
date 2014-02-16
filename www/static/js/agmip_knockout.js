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


//-----------------------------------------for accessing the element binded to an observable
ko.bindingHandlers.accessDOMElement = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel) { 
	valueAccessor().extend({element: element });
	}
};

ko.extenders.element = function (target, element) 
{
  target.DOMElement = element;
}
//-----------------------------------------for accessing the element binded to an observable


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


	//-------------------------show or hides the checkbox when the variable "checked" changes
	self.checked.subscribe(function(newValue) {
		//whenever this observable changes, the view will be updated with jquery
		$(this.target.DOMElement).prop('checked', newValue);
	});
	//-------------------------show or hides the checkbox when the variable "checked" changes

}


function all_experiments() {
	var self = this;
	
	self.current_data 			= ko.observableArray([]);
	self.saved_data 			= ko.observableArray([]);		
	self.selected_all_checked 	= ko.observable(false);	
	
	//----------------------show or hides the checkbox when the variable "selected_all_checked" changes		
	self.selected_all_checked.subscribe(function(newValue) {
	//whenever this observable changes, the view will be updated with jquery
	$(this.target.DOMElement).prop('checked', newValue);
	});
	//----------------------show or hides the checkbox when the variable "selected_all_checked" changes		
	
	
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

			if(index == -1)
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
			
			if(saved_data_index != -1)
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
		if( saved_data_index == -1)		//(4a)
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
			if(eid == array[i]["eid"])
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

