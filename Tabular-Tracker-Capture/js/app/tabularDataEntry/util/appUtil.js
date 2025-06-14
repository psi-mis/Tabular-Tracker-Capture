
function DHISUtil() {}

DHISUtil.data = { version: "" };

DHISUtil.retrieveAndSet_DHISData = function()
{
	// Only version info for now.
	RESTUtil.getAsynchData( _queryURL_systemInfo
	, function( json_data ) 
	{
		DHISUtil.data.version = json_data.version;
	});

	selectionTree.clearSelectedOrganisationUnits();
}

DHISUtil.getDHISVersion = function()
{
	return DHISUtil.data.version;
}

// --------------------------------------------------------------------------------
// DHIS Util
// --------------------------------------------------------------------------------

DHISUtil.preRetrieve_UserInfo = function()
{
	// pre retrieve user info by using 'retrieveManager', which saves/reuse the retrieval.
	DHISUtil.retrieveUserInfo();
}

DHISUtil.retrieveUserInfo = function( runFunc )
{
	RESTUtil.retrieveManager.retrieveData( _queryURL_me + '.json?fields=*,userCredentials[*,userRoles[id,name,authorities]],organisationUnits[id,name]'
	, function( json_data ) 
	{
		if ( runFunc !== undefined ) runFunc( json_data );
	});			
}

DHISUtil.retrieveUserAccount = function( runFunc )
{
	RESTUtil.retrieveManager.retrieveData( _queryURL_me 
	, function( json_data ) 
	{
		if ( runFunc !== undefined ) runFunc( json_data );
	});			
}


// --------------------------------------------------------------------------------
// App Util
// --------------------------------------------------------------------------------

function AppUtil() {}

AppUtil.CheckCachedFileSynch = function()
{
	var outOfSynch = false;
	var msg = "";

	if ( RESTUtil.retrieveManager === undefined )
	{
		outOfSynch = true;
		msg += "RESTUtil.retrieveManager not found";
	}

	if ( outOfSynch )
	{
		alert( $( 'span.msg_CacheClear' ).text() );
	}
}


AppUtil.copyAncestorsToParents = function( ouList )
{
	if ( ouList.length > 0 
		&& ouList[0].parents === undefined 
		&& ouList[0].ancestors !== undefined 
		)
	{
		$.each( ouList, function( i_ou, item_ou )
		{
			item_ou.parents = item_ou.ancestors;
		});
	}
}

AppUtil.pageHScroll = function( option )
{
	if ( option === "Right" )
	{
		// Scroll to right end
		var left = $(document).outerWidth() - $(window).width();
		$('body, html').scrollLeft( left );
	}
	else
	{
		$('body, html').scrollLeft( 0 );
	}
}

// --------------------------------------------------------------------------------
// FormUtil
// --------------------------------------------------------------------------------

function FormUtil() {}

FormUtil.setTagAsWait_SetRows = function( tagRows )
{
	tagRows.each( function( i )
	{
		me.setTagAsWait( $( this ) );
	});
}

FormUtil.setTagAsWait = function( tag, classNameInput )
{
	var className = ( classNameInput !== undefined ) ? classNameInput : 'waitRow' ;
	tag.addClass( className );
	
	Util.disableTag( tag, true );
}

FormUtil.setTagAsWait_Clear = function( tag, classNameInput )
{
	var className = ( classNameInput !== undefined ) ? classNameInput : 'waitRow' ;
	tag.removeClass( className );
	
	Util.disableTag( tag, false );
}

FormUtil.setSelectTagOptions_YesNo = function( ctrlTag )
{
	ctrlTag.append('<option value="">[Please select]</option>');
	ctrlTag.append('<option selected="selected" value="true">Yes</option>');
	ctrlTag.append('<option value="false">No</option>');
}

FormUtil.getStr_Views = function()
{
	return "input[" + _view + "='" + _view_Yes + "'],select[" + _view + "='" + _view_Yes + "'],textarea[" + _view + "='" + _view_Yes + "']";
}

FormUtil.setTabBackgroundColor_Switch = function( ctrlTags )
{
	ctrlTags.focus( function()
	{
		$( this ).closest( 'td' ).addClass( 'tdInFocus' ); 
	});

	ctrlTags.focusout( function()
	{
		$( this ).closest( 'td' ).removeClass( 'tdInFocus' ); 
	});
}

FormUtil.getFormattedAttributeValue = function( attrType, attrValue )
{
	if ( attrType == "DATE" )
	{
		attrValue = Util.formatDateBack( attrValue.substring( 0, 10 ) );
	}
	else if ( attrType == "TIME" )
	{
		attrValue = Util.formatTimeBack( attrValue );
	}
	else if ( attrType == "DATETIME" )
	{
		attrValue =Util.formatDateTimeBack( attrValue );
	}
	else if ( attrType == "COORDINATE" )
	{
		attrValue = FormUtil.formatCoordinatorsValue( attrValue );
	}
	
	return attrValue;
}

FormUtil.abortAndClear_XhrRequest = function( xhrRequests )
{
	$.each( xhrRequests, function( i_xhr, item_xhr )
	{
		item_xhr.abort();
	});

	return [];
}

FormUtil.validateValueType = function( tag, inputType )
{
	var pass = true;

	// Clear
	Util.paintClear( tag );
	tag.attr( 'title', '' );
	tag.attr( 'notvalid', '' );

	var emptyValCase = ( tag.val() === '' );

	if ( inputType == "NUMBER" )
	{
		//console.log( 'Number Validation, val: ' + tag.val() );
		
		var reg = /\d+(\.\d+)?/i; // new RegExp( '^\d+[\.\d+]*$' );	// '^\d+[\.\d+]*$'	// ^[-+]?\d+(\.\d+)?$

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Number Only field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "INTEGER" )
	{
		var reg = new RegExp( '^(-)*[0-9]+$' );

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Integer Only field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "INTEGER_POSITIVE" )
	{
		var reg = new RegExp( '^[1-9]+[0-9]*$' );

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Positive Integer Only field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "INTEGER_ZERO_OR_POSITIVE" )
	{
		var reg = new RegExp( '^[0-9]+$' );

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Zero or Positive Integer Only field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "INTEGER_NEGATIVE" )
	{
		var reg = new RegExp( '^(-)[1-9]+[0-9]*$' );

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Negative Integer Only field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "UNIT_INTERVAL" )
	{
		if( tag.val() != "0" && tag.val() != "1" )
		{
			var reg = new RegExp( '^(0\\.)[0-9]+$' );

			if ( !emptyValCase && !reg.test( tag.val() ) )
			{
				Util.paintWarning( tag );
				tag.attr( 'title', 'This field only accepts a decimal value between 0 and 1.' );
				tag.attr( 'notvalid', 'Y' );
				pass = false;
			}
		}
	}
	else if ( inputType == "COORDINATE" )
	{
		if ( !emptyValCase )
		{
			var coordinators = tag.val().replace("[", "" ).replace("]", "" );
		
			var reg = new RegExp( '^[0-9]+\.*[0-9]*,\s?[0-9]+\.*[0-9]*$' );
			
			if ( !reg.test( coordinators ) )
			{
				pass = false;
			}
			else
			{
				var coordinators = tag.val().replace("[", "" ).replace("]", "" ).split(",");
			
				var reg = new RegExp( '^[0-9]*$' );
				if ( reg.test( coordinators[0] ) && reg.test( coordinators[1] ) )
				{
					var lng = eval( coordinators[0] );
					var lat = eval( coordinators[1] );
					pass = (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90);
				}
				else
				{
					pass = false;
				}
			}
		}
		
		if( !pass )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is not in valid coordinators format, [xx,xx]' );
			tag.attr( 'notvalid', 'Y' );
		}
	}
	else if ( inputType == "LETTER" )
	{
		var reg = new RegExp( '^[a-zA-Z]+$' );

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Letter Only field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "DATE" )
	{
		// Due to '/' not doing date check properly, change to '-'
		var dateStr = tag.val().replace( /\//ig, '-' );

		if ( !emptyValCase && !moment( dateStr ).isValid() )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'The date is not valid date.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if ( inputType == "URL" )
	{		
		var reg = /(http(s)?:\/\/)(\w)+.(\w)+.(\w)+(\/)?/; // = /https?:\/\//i; // new RegExp( '^\d+[\.\d+]*$' );	// '^\d+[\.\d+]*$'	// ^[-+]?\d+(\.\d+)?$

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is URL type, format starts with "http(s)://-.-.-(/)"' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}
	else if( inputType == "EMAIL" )
	{
		var reg = new RegExp( '^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$' );

		if ( !emptyValCase && !reg.test( tag.val() ) )
		{
			Util.paintWarning( tag );
			tag.attr( 'title', 'This field is Email field.' );
			tag.attr( 'notvalid', 'Y' );
			pass = false;
		}
	}

	return pass;
};


FormUtil.checkGeoLocation = function( checkLocation, returnFunc )
{
	if ( checkLocation )
	{
		//console.log( navigator.geolocation );	
		navigator.geolocation.getCurrentPosition(
			function( position ) 
			{
				returnFunc( position );				
			}
			, function( msg ) 
			{
				returnFunc();
			});	
	}
	else
	{
		returnFunc();
	}
};

FormUtil.formatCoordinatorsValue = function( coordinates )
{
	coordinates = coordinates.replace("[", "").replace("]", "");
	coordinates = "[" + coordinates + "]";
	
	if( _settingForm.DHISVersion == "2.25" || _settingForm.DHISVersion == "2.26" )
	{
		return coordinates.replace("[", "").replace("]", "");
	}
	
	return coordinates;
};

FormUtil.setGeometryJson = function( jsonData, coords )
{
	if ( coords )
	{
		jsonData.geometry = {};
		jsonData.geometry.type = "Point";
		jsonData.geometry.coordinates = [ coords.longitude, coords.latitude ];
		jsonData.geometry.coordinate = { "latitude": coords.latitude, "longitude": coords.longitude };
	}
};

// NOTE: Somehow, on create, we need to pass coordinate info rather than geometry info...  Maybe both?
FormUtil.getCoordinateJson = function( jsonData, coords )
{
	if ( coords ) {
		jsonData.geometry = {};
		jsonData.geometry.type = "Point",
		jsonData.geometry.coordinates = [ coords.longitude, coords.latitude ];
		jsonData.geometry.coordinate = { "latitude": coords.latitude, "longitude": coords.longitude };
	}
};


FormUtil.addItemJson = function( list, idStr, idTypeName, dataValue, updateCase, savedFunc, skippedFunc )
{
	var saved = false;

	if ( updateCase )
	{
		var itemJson = Util.getFromList( list, idStr, idTypeName );

		if ( dataValue )
		{
			// If form entry value exists, set it to attribute saving.
			if ( itemJson ) itemJson.value = dataValue;
			else 
			{
				itemJson = {};
				itemJson[ idTypeName ] = idStr;
				itemJson.value = dataValue;
				list.push( itemJson );
			}

			saved = true;
		}
		else
		{
			// If form entry value is emtpy, but there were existing value, we should update it to empty case..
			if ( itemJson && itemJson.value )
			{
				itemJson.value = '';
				saved = true;
			}
		}
	}
	else
	{
		// For new case, simply add to the attributes list
		if ( dataValue ) 
		{
			var itemJson = {};
			itemJson[ idTypeName ] = idStr;
			itemJson.value = dataValue;

			list.push( itemJson );
			saved = true;
		}
	}

	if ( saved )
	{
		if ( savedFunc ) savedFunc(); 
	}
	else
	{
		if ( skippedFunc ) skippedFunc(); 
	}
};

// --------------------------------------------------------------------------------
// PersonUtil
// --------------------------------------------------------------------------------

function PersonUtil() {}

PersonUtil.primaryAttributeVal = "PrimaryAttributeVal";

PersonUtil.getPersonByID = function( personId, programId )
{
	return $.parseJSON( RESTUtil.getSynchData( _queryURL_PersonQuery + "/" + personId + ".json?fields=*&program=" + programId ) );			
}

PersonUtil.clearPersonByID_Reuse = function( personId, programId )
{
	var queryUrl = _queryURL_PersonQuery + "/" + personId + ".json?fields=*&program=" + programId;
	
	// remove any saved data from memory
	RESTUtil.retrieveManager.removeFromMemory( queryUrl );
};

PersonUtil.getPersonByID_Reuse = function( personId, programId, successFunc, finalFunc )
{			
	var queryUrl = _queryURL_PersonQuery + "/" + personId + ".json?fields=*&program=" + programId;

	RESTUtil.retrieveManager.retrieveData( queryUrl
	, successFunc
	, function()
	{
		console.log( "FAILED -- PersonUtil getPersonByID_Async(), personId: " + personId ); 
	}
	, function() {}
	, function() { if ( finalFunc !== undefined ) finalFunc(); } 
	);	
}

PersonUtil.getPersonByID_Reuse_ManualInsert = function( personId, programId, json_Data )
{
	var queryUrl = _queryURL_PersonQuery + "/" + personId + ".json?fields=*&program=" + programId;

	RESTUtil.retrieveManager.insertDirectToMemory( json_Data, queryUrl );	
}

//RESTUtil.getAsynchData( _queryURL_PersonQuery + "/" + personId + ".json"
//PersonUtil.getPersonByID_Reuse = function( personId, actionSuccess, actionError, loadingStart, loadingEnd )


PersonUtil.addIDtypeToID = function( item_Person )
{
	if ( Util.checkDefined( item_Person ) )
	{
		// Set attributeID as ID
		if( Util.checkDefined( item_Person.attributes ) )
		{
			$.each( item_Person.attributes, function( i_attribute, item_attribute ) 
			{
				item_attribute.id = item_attribute.attribute;
			});
		}
	}
}


PersonUtil.setPersonWithFirstAttributeData = function( personObjList, firstAttributeId )
{
	$.each( personObjList, function( i_person, item_person )
	{
		var attritubeValue = "";

		if ( item_person.attributes === undefined )
		{
			item_person[ PersonUtil.primaryAttributeVal ] =  "";
		}
		else
		{
			// look for attribute value with id
			$.each( item_person.attributes, function( i_attribute, item_attribute )
			{
				if ( item_attribute.attribute == firstAttributeId )
				{
					attritubeValue = item_attribute.value;
					return false;
				}
			});

			item_person[ PersonUtil.primaryAttributeVal ] =  attritubeValue;

		}
	});
}


PersonUtil.setTagTypeValidation = function( inputTags, inputType )
{			
	inputTags.off( "change" ).on( "change", function ( event ) 
	{
		var tag = $( this );

		FormUtil.validateValueType( tag, inputType );
	});
}



// --------------------------------------------------------------------------------
// EventUtil
// --------------------------------------------------------------------------------

function EventUtil() {}

EventUtil.varSrcType_TEI_Attribute = "TEI_ATTRIBUTE";
EventUtil.varSrcType_DE_CurrentEvent = "DATAELEMENT_CURRENT_EVENT";
EventUtil.varSrcType_DE_NewestEventInProgram = "DATAELEMENT_NEWEST_EVENT_PROGRAM";
EventUtil.varSrcType_DE_NewestEventInProgStage = "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE";
EventUtil.varSrcType_DE_PreviousEvent = "DATAELEMENT_PREVIOUS_EVENT";


EventUtil.getProgramStageId_FromRow = function( trEventRow )
{
	return trEventRow.find( "select.eventStage" ).attr( "selectedProgramStage" );
}

EventUtil.getEventId_FromRow = function( trEventRow )
{
	return trEventRow.attr( "uid" );
}


EventUtil.clearLatestEvent_Reuse = function( TabularDEObj, personId )
{			
	var orgUnitId = TabularDEObj.getOrgUnitId();
	var programId = TabularDEObj.getSelectedProgramId();

	var queryUrl = _queryURL_EventQuery + "&orgUnit=" + orgUnitId + "&program=" + programId + "&trackedEntityInstance=" + personId;

	// remove any saved data from memory
	RESTUtil.retrieveManager.removeFromMemory( queryUrl );
};

EventUtil.getLatestEvent_Reuse = function( TabularDEObj, personId, successFunc, finalFunc )
{
	var orgUnitId = TabularDEObj.getOrgUnitId();
	var programId = TabularDEObj.getSelectedProgramId();

	var queryUrl = _queryURL_EventQuery + "&orgUnit=" + orgUnitId + "&program=" + programId + "&trackedEntityInstance=" + personId;
	

	RESTUtil.retrieveManager.retrieveData( queryUrl
	, successFunc
	, function()
	{
		console.log( "FAILED -- EventUtil getLatestEvent_Reuse(), queryUrl: " + queryUrl ); 
	}
	, function() {}
	, function() { if ( finalFunc !== undefined ) finalFunc(); } 
	);	
}


EventUtil.getEventBySrcType = function( reuse, orgUnitId, programId, personId, srcType, programStageId, currEventId, successFunc, finalFunc )
{
	var retrievalFunc = ( reuse ) ? RESTUtil.retrieveManager.retrieveData : RESTUtil.getAsynchData;

	var queryUrl = _queryURL_EventQuery + "&orgUnit=" + orgUnitId + "&program=" + programId + "&trackedEntityInstance=" + personId;
	
	retrievalFunc( queryUrl
	, function( item_Events )
	{
		var foundEvent;

		if ( item_Events !== undefined && item_Events.events !== undefined && item_Events.events.length > 0 )
		{
			var events_InReverse = Util.sortByKey_Reverse( item_Events.events, "eventDate" );				

			if ( srcType == EventUtil.varSrcType_DE_NewestEventInProgram )
			{
				foundEvent = events_InReverse[0];
			}
			else if ( srcType == EventUtil.varSrcType_DE_NewestEventInProgStage )
			{
				foundEvent = ( programStageId ) ? ( Util.getMatchesFromList( events_InReverse, programStageId, "programStage" ) )[0] : events_InReverse[0];
			}
			else if ( srcType == EventUtil.varSrcType_DE_PreviousEvent && currEventId )
			{

				console.log( 'DATAELEMENT_PREVIOUS_EVENT case' );

				var lastWasCurrentEvent = false;

				$.each( events_InReverse, function( i_event, item_event )
				{

					console.log( 'events' );

					if ( lastWasCurrentEvent )
					{
						lastWasCurrentEvent = false;
						foundEvent = item_event;
						return false;
					}

					if ( item_event.event == currEventId ) lastWasCurrentEvent = true;

				});

				console.log( 'foundEvent: ' + JSON.stringify( foundEvent ) );

			}
		}

		// Do not need to run 'successFunc' if no result found
		if ( foundEvent !== undefined ) successFunc( foundEvent );
	}
	, function()
	{
		console.log( "FAILED -- EventUtil getEventBySrcType_Reuse(), queryUrl: " + queryUrl ); 
	}
	, function() {}
	, function() { if ( finalFunc !== undefined ) finalFunc(); } 
	);	
}

// (Functions not yet populated much - move from PersonEvent class)
EventUtil.appendSelectOption_Option = function( selectTag, item_Option )
{
	if ( typeof item_Option === "string" )
	{
		selectTag.append( "<option>" + item_Option + "</option>" );
	}
	else if ( typeof item_Option === "object" && item_Option != null )
	{
		selectTag.append( "<option value='" + item_Option.code  + "'>" + item_Option.displayName + "</option>" );
	}
}

EventUtil.getNextRowFocus_Event = function( trCurrent )
{
	var nextRowEventTag;

	var trTable = trCurrent.closest( 'table' );
	var trCurrent_EventRowNo = parseInt( trCurrent.attr( 'eventrowno' ) );

	
	trTable.find( 'tr.trEventData' ).each( function()
	{
		var eventRowNo = parseInt( $( this ).attr( 'eventrowno' ) );

		if( eventRowNo > trCurrent_EventRowNo )
		{
			var list = $( this ).find( 'input,select' ).filter( ':visible' ).filter( ':enabled' );
			if ( list.length > 0 )
			{
				nextRowEventTag = list.first();
				return false;
			}
		}
	});

	
	// If next row active tags were not found, focus on the button.
	if ( nextRowEventTag === undefined )
	{
		var buttonTag = trTable.parent().find( '.personEvent_addNewRow' );

		if ( buttonTag.length == 1 )
		{
			nextRowEventTag = buttonTag;
		}
	}


	return nextRowEventTag;
}
