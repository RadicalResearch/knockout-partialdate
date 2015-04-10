# knockout-partialdate
KnockoutJS partial date extender

## Install

    bower install knockout-partial

## Usage

	// Create date observable
	var value = new Date();
	var date = ko.observable(value).extend({"partialdate": true});
	
	// Log changes to the console
	date.subscribe(function(newValue){ console.log('Date changed', newValue); });
	date.year.subscribe(function(newValue){ console.log('Year changed', newValue); });
	
	// Change parts of the date. Each change will update the 'date' observable
	date.day(8);
	date.month(2);
	date.year(1985);
	
	// Change the date. Updates each of the partial observables.
	date(new Date());
	
	