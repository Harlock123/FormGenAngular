import { Injectable } from '@angular/core';
import { Console } from 'console';

@Injectable( {providedIn: 'root'} )

export class FormGenBS {

    private theUIInteractions: UIInteraction[] = [];
    private theContainer: string;
    public static theUIElements: UIElement[] = [];
    public static theVersionString: string = "";
    private JSOBJECTNAME: string = "";
    private EnableGreenbar: boolean = false;
    private GreenBarColor: string = "lightgreen";
    private DOINTERACTION;
    private AllowInteractions: boolean = true;
    private TheInputIDs: string[] = [];

    private TheCurrentNumberOfInputElements = 0;

    constructor() {

        // set the form version here
       // FormGenBS.theVersionString = VersionString;

        // DomElementID will be the container for all the inserted form content

        // save the containerID for further use elsewhere
        // this.theContainer = DomElementID;

        // save the name the particular instance is called for event wireup
        // this.JSOBJECTNAME = JSobjectName;

        // this.HydrateForm(UIElements);

        this.DOINTERACTION = function (e: any) { this.DoFormGenInteraction(e); }


    }

    public HydrateForm(UIElements: UIElement[]) {

        // sort the array first by the rows
        UIElements.sort(function (a, b) {
            if (a.elFormRow < b.elFormRow)
                return -1;
            if (a.elFormRow > b.elFormRow)
                return 1;
            return 0;
        });

        // Clear the existing arrays of other stuff

        FormGenBS.theUIElements = [];
        this.theUIInteractions = [];

        // Lets kill the existing string array of InputIDs to clear the list for repopulation
        this.TheInputIDs = [];

        // Now we want to Pupulate the Saved UIELEMENTS array with each element from the sorted handed in
        // uielements but we want to renumber the ROWIDs so they are not sparce and are ordinal.
        // This should prevent Holes in the output

        var rc = 0;
        var oldID = 0;

        for (let THEEL of UIElements) {
            if (THEEL.elFormRow !== oldID) {
                rc += 1;
                oldID = THEEL.elFormRow;
                THEEL.elFormRow = rc;
                FormGenBS.theUIElements.push(THEEL);
            }
            else {
                THEEL.elFormRow = rc;
                FormGenBS.theUIElements.push(THEEL);
            }
        }

        // this.theUIElements should now contain a renumbered array of stuff

        UIElements = FormGenBS.theUIElements;


        // save the handed in UIElements for further processing later
        // this.theUIElements = UIElements;

        // here we will preparse the UIElements to determine the formgrouping
        // for the purposes of selecting the appropriate columnar layout characteristics
        // to employ for each form row

        var FROWS: number[] = [];
        var BOOTSTRAPTAGS: string[] = [];
        var FROWTAGS: string[] = [];
        var row = 0;
        var cnt = 0;

        var eventwirup = this.JSOBJECTNAME + ".DOINTERACTION(this)";

        for (let THEEL of UIElements) {
            if (THEEL.elFormRow !== row) {
                // we have a new row lets push the old row
                FROWS.push(cnt);
                cnt = 1;
                row = THEEL.elFormRow;
            }
            else {
                cnt += 1;
            }
        }

        FROWS.push(cnt);
        
        cnt = 0;
        
        // we now have an array of numbers the ordinal position in that array has the number of
        // elements that are in that forms row as defined by the UIElements array handed in
        // Starting from 1 (The Zero element in the array should have 0 in it so its 1 based)
        // assuming that the numbered rows handed in started at 1...

        // now lets iterate over the list of FORM ROWS and determine the BOOTSTRAP Tags to employ on each of those rows

        for (let RRR of FROWS) {
            if (RRR !== 0) {
                switch (RRR) {
                    case 1: {
                        BOOTSTRAPTAGS.push("col-md-12");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                    case 2: {
                        BOOTSTRAPTAGS.push("col-md-6");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                    case 3: {
                        BOOTSTRAPTAGS.push("col-md-4");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                    case 4: {
                        BOOTSTRAPTAGS.push("col-md-3");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                    case 6: {
                        BOOTSTRAPTAGS.push("col-md-2");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                    case 12: {
                        BOOTSTRAPTAGS.push("col-md-1");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                    default: {
                        BOOTSTRAPTAGS.push("col-md-1");

                        for (let THEEL of UIElements) {
                            if (THEEL.elFormRow === cnt) {
                                FROWTAGS.push(THEEL.elStyle);
                                break;
                            }
                        }

                        break;
                    }
                }
            }
            cnt += 1;
        }

        // Our BOOTSTRAPTAGS array now has the element for each row in the resulting form

        // get the actual html element where we will put all this stuff
        var el = document.getElementById(this.theContainer);
        var innerhtml = '<div class="card-body"><form> ';

        var InputElementTabCount = 0;

        var CURROW = 0;

        for (let CBTAG of BOOTSTRAPTAGS) {
            CURROW += 1;


            if (this.EnableGreenbar) {
                if (CURROW % 2 === 0) // even
                {
                    innerhtml += '<div class="form-row" >';
                }
                else {
                    innerhtml += '<div class="form-row" style="background-color:' + this.GreenBarColor + '" >';
                }

            }
            else {
                // If the calculated style for the Current Row is empty dont emit a STYLE tag
                if (FROWTAGS[CURROW - 1] !== '')
                    innerhtml += '<div class="form-row" style="' + FROWTAGS[CURROW - 1] + '" >';
                else
                    innerhtml += '<div class="form-row" >';
            }

            for (let THEEL of UIElements) {

                if (THEEL.elFormRow === CURROW) { // We have an element that is going into the curent row

                    switch (THEEL.elType.toUpperCase()) {
                        case "TEXT": {

                            // here we decode the elFormStyle element if its present

                            var STY = "";
                            var CC = "form-control input-md"; // for TEXT inputs

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }

                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }
                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';
                            }

                            if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                                innerhtml += '<input type="text" class="' + CC + '" name = "' + THEEL.elID +
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" id="' + THEEL.elID + '" style="' + THEEL.elFormStyle + '"  > ';

                            }
                            else {
                                for (let v of THEEL.elInteractions) {
                                    this.theUIInteractions.push(v);
                                }

                                innerhtml += '<input type="text" class="' + CC + '" name = "' + THEEL.elID +
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" id="' + THEEL.elID + '" onchange="' + eventwirup + '" style="' + 
                                    THEEL.elFormStyle + '" > ';

                            }

                            // store the ID for Interactivity processing

                            this.TheInputIDs.push(THEEL.elID);

                            innerhtml += '</div></div> ';

                            InputElementTabCount += 1;

                            break;

                        }
                        case "DATE": {
                            // here we decode the elFormStyle element if its present

                            var STY = "";
                            var CC = "form-control input-md"; // for TEXT inputs

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }
                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }
                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';
                            }

                            if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                                innerhtml += '<input type="date" class="' + CC + '" name = "' + THEEL.elID +
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" id="' + THEEL.elID + '" style="' + THEEL.elFormStyle + '" > ';
                            }
                            else {
                                for (let v of THEEL.elInteractions) {
                                    this.theUIInteractions.push(v);
                                }

                                innerhtml += '<input type="date" class="' + CC + '" name = "' + THEEL.elID +
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" id="' + THEEL.elID + '" onchange="' + eventwirup + '" style="' + 
                                    THEEL.elFormStyle + '" > ';
                            }

                            // store the ID for Interactivity processing

                            this.TheInputIDs.push(THEEL.elID);

                            innerhtml += '</div></div> ';

                            InputElementTabCount += 1;

                            break;

                        }
                        case "NARRATIVE": {
                            // here we decode the elFormStyle element if its present

                            var STY = "";
                            var CC = "form-control input-md"; // for TEXT inputs

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }
                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';
                            }

                            if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                                innerhtml += '<textarea rows="5" cols="40" class="' + CC + '" name="' + THEEL.elID + 
                                    '" id="' + THEEL.elID + 
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" style="' + THEEL.elFormStyle + '" ></textarea> ';
                            }
                            else {
                                for (let v of THEEL.elInteractions) {
                                    this.theUIInteractions.push(v);
                                }

                                innerhtml += '<textarea rows="5" cols="40" class="' + CC + '" name="' + THEEL.elID + 
                                    '" id="' + THEEL.elID + 
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" onchange="' + eventwirup + '" style="' + THEEL.elFormStyle + '" ></textarea> ';
                            }

                            // store the ID for Interactivity processing

                            this.TheInputIDs.push(THEEL.elID);

                            innerhtml += '</div></div> ';

                            InputElementTabCount += 1;

                            break;

                        }
                        case "RADIO": {
                            // here we decode the elFormStyle element if its present

                            var STY = "";
                            var CC = "custom-control-input";

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }

                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {

                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '"  >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '"  >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';
                            }

                            let i = 0;
                            for (let v of THEEL.elContent) {
                                i += 1;

                                innerhtml += '<div class="custom-control custom-radio custom-control-inline">';

                                if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                                    innerhtml += '<input type="radio" class="' + CC + '" ' +
                                        'name = "' + THEEL.elID + '" id="' +
                                        THEEL.elID + '_' + i.toString() + '" ' +
                                        ' tabindex="' + InputElementTabCount + '" ' +
                                        'value="' + v + '" style="' + THEEL.elFormStyle + '" >';
                                    innerhtml += '<label for="' + THEEL.elID + '_' + i.toString() + '" class="custom-control-label" >' + v + '</label>';
                                }
                                else {
                                    for (let v of THEEL.elInteractions) {
                                        this.theUIInteractions.push(v);
                                    }
                                    innerhtml += '<input type="radio" class="' + CC + '" ' +
                                        'name = "' + THEEL.elID + '" id="' +
                                        THEEL.elID + '_' + i.toString() + '" ' +
                                        ' tabindex="' + InputElementTabCount + '" ' +
                                        'value="' + v + '" onchange="' + eventwirup + '" style="' + THEEL.elFormStyle + '" >';
                                    innerhtml += '<label for="' + THEEL.elID + '_' + i.toString() + '" class="custom-control-label" >' + v + '</label>';
                                }

                                // store the ID for Interactivity processing

                                this.TheInputIDs.push(THEEL.elID + '_' + i.toString());

                                innerhtml += "</div>";

                                InputElementTabCount += 1;
                            }

                            innerhtml += '</div></div> ';

                            break;
                        }
                        case "DROPDOWN": {
                            // here we decode the elFormStyle element if its present

                            var STY = "";
                            var CC = "form-control input-md"; // for TEXT inputs

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }
                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }


                            if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                                innerhtml += '<select name="' + THEEL.elID + '" class="' + CC + '"  id="' +
                                    THEEL.elID + '" tabindex="' + InputElementTabCount + '" ' + 
                                    '" style="' + THEEL.elFormStyle + '" >';
                            }
                            else {
                                for (let v of THEEL.elInteractions) {
                                    this.theUIInteractions.push(v);
                                }

                                innerhtml += '<select name="' + THEEL.elID +
                                    '" class="' + CC + '" id="' + THEEL.elID +
                                    '" tabindex="' + InputElementTabCount + '" ' +
                                    '" onchange="' + eventwirup + '" style="' + THEEL.elFormStyle + '" >';
                            }

                            // store the ID for Interactivity processing

                            this.TheInputIDs.push(THEEL.elID);

                            // Lets put the Watermark in here
                            innerhtml += '<option value="" disabled selected hidden>Please Select </option>';

                            let i = 0;
                            for (let v of THEEL.elContent) {
                                i += 1;
                                innerhtml += '<option ' +
                                    'name = "' + THEEL.elID + '" id="' +
                                    THEEL.elID + '_' + i.toString() + '" ' +
                                    'value="' + v + '" >' + v + '</option> ';
                            }
                            innerhtml += '</select>';

                            innerhtml += '</div></div> ';

                            InputElementTabCount += 1;

                            break;

                        }
                        case "CHECKBOX": {
                            // here we decode the elFormStyle element if its present

                            var STY = "";
                            var CC = "custom-control-input";

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }

                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '</table>';
                            }

                            let i = 0;
                            for (let v of THEEL.elContent) {
                                i += 1;

                                innerhtml += '<div class="custom-control custom-checkbox custom-control-inline">';

                                if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                                    innerhtml += '<input type="checkbox" ' +
                                        'name = "' + THEEL.elID + '" class="' + CC + '"  id="' +
                                        THEEL.elID + '_' + i.toString() + '" ' +
                                        ' tabindex="' + InputElementTabCount + '" ' +
                                        'value="' + v + '" style="' + THEEL.elFormStyle + '" >';
                                    innerhtml += '<label for="' + THEEL.elID + '_' + i.toString() + '" class="custom-control-label"  >' + v + '</label>';
                                }
                                else {
                                    for (let v of THEEL.elInteractions) {
                                        this.theUIInteractions.push(v);
                                    }
                                    innerhtml += '<input type="checkbox" ' +
                                        'name = "' + THEEL.elID + '" class="' + CC + '"  id="' +
                                        THEEL.elID + '_' + i.toString() + '" ' +
                                        ' tabindex="' + InputElementTabCount + '" ' +
                                        'value="' + v + '" onchange="' + eventwirup + '" style="' + THEEL.elFormStyle + '" >';
                                    innerhtml += '<label for="' + THEEL.elID + '_' + i.toString() + '" class="custom-control-label" >' + v + '</label>';
                                }

                                // store the ID for Interactivity processing

                                this.TheInputIDs.push(THEEL.elID + '_' + i.toString());

                                innerhtml += "</div>";

                                InputElementTabCount += 1;
                            }

                            innerhtml += '</div></div> ';

                            break;

                        }
                        case "INFOTEXT": {
                            var STY = "";

                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                            innerhtml += '<label for="div_' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                            innerhtml += THEEL.elLabel;
                            innerhtml += '</label> ';

                            if (THEEL.elContent.length !== 0) {
                                // we have some items for an actual list

                                innerhtml += '<ul style="' + THEEL.elFormStyle + '">';

                                for (let v of THEEL.elContent) {
                                    innerhtml += '<li>' + v + '</li>';

                                }

                                innerhtml += '</ul>';
                            }

                            innerhtml += '</div></div> ';

                            break;

                        }
                        case "HEADER": {
                            var STY = "";

                            if (THEEL.elStyle !== "") {
                                STY = ' style="text-align:center;vertical-align:middle;margin-bottom:0; ' + THEEL.elStyle + '" ';
                            }
                            else {
                                STY = ' style="text-align:center;vertical-align:middle;margin-bottom:0" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                            innerhtml += '<label for="div_' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                            innerhtml += THEEL.elLabel;
                            innerhtml += '</label>';

                            innerhtml += '</div></div> ';

                            break;

                        }
                        case "FOOTER": {
                            var STY = "";

                            if (THEEL.elStyle !== "") {
                                STY = ' style="text-align:center;vertical-align:middle;margin-bottom:0; ' + THEEL.elStyle + '" ';
                            }
                            else {
                                STY = ' style="text-align:centervertical-align:middle;margin-bottom:0" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                            innerhtml += '<label for="div_' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                            innerhtml += THEEL.elLabel;
                            innerhtml += '</label>';

                            innerhtml += '</div></div> ';

                            break;
                        }
                        case "RECXOFY": {
                            var STY = "";
                            var CC = "custom-control-input";

                            if (THEEL.elCustomClass !== "" && THEEL.elCustomClass !== undefined) {
                                CC = THEEL.elCustomClass;
                            }

                            if (THEEL.elStyle !== "") {
                                STY = ' style="' + THEEL.elStyle + '" ';
                            }

                            var VIS = "";// 'style="display:block"';

                            if (!THEEL.elInitialVisibility) {
                                VIS = 'style="display:none"';
                            }

                            if (THEEL.elAutoSize) {
                                innerhtml += '<div class="col-auto" >';
                            }
                            else {
                                innerhtml += '<div class="' + CBTAG + '" >';
                            }

                            if (THEEL.elRequired) {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table style="width:100%">';
                                innerhtml += '<td valign="top" class="text-red"> * </td>';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '<td style="float:right"><span class="RECXofYSPAN" id="span_' + THEEL.elID + '"style="background-color:white">' + ' + ' + '</span></td>';
                                innerhtml += '</table>';

                            }
                            else {
                                innerhtml += '<div class="form-group" id="' + 'div_' + THEEL.elID + '" ' + VIS + STY + ' >';
                                innerhtml += '<table style="width: 100%">';
                                innerhtml += '<td>';
                                innerhtml += '<label for="' + THEEL.elID + '" style="white-space: normal;' + THEEL.elLabelStyle + '" >';
                                innerhtml += THEEL.elLabel;
                                innerhtml += '</label>';
                                innerhtml += '</td>';
                                innerhtml += '<td style="float:right"><span class="RECXofYSPAN" id="span_' + THEEL.elID + '"style="background-color:white">' + ' + ' + '</span></td>';
                                innerhtml += '</table>';
                            }

                            innerhtml += '<table style="width:100%;background-color:white">';
                            innerhtml += '<tr>';

                            for (let v of THEEL.elContent) {
                                innerhtml += '<th>' + v + '</th>';
                            }
                            innerhtml += '</tr>';

                            innerhtml += '<tr>';

                            for (let v of THEEL.elContent) {
                                innerhtml += '<td>' + ' ' + '</td>';
                            }
                            innerhtml += '</tr>';

                            // let i = 0;
                            // for (let v of THEEL.elContent) {
                            //     i += 1;

                            //     innerhtml += '<div class="custom-control custom-checkbox custom-control-inline">';

                            //     if (!Array.isArray(THEEL.elInteractions) || !THEEL.elInteractions.length) {
                            //         innerhtml += '<input type="checkbox" ' +
                            //             'name = "' + THEEL.elID + '" class="' + CC + '"  id="' +
                            //             THEEL.elID + '_' + i.toString() + '" ' +
                            //             'value="' + v + '" style="' + THEEL.elFormStyle + '" >';
                            //         innerhtml += '<label for="' + THEEL.elID + '_' + i.toString() + '" class="custom-control-label"  >' + v + '</label>';
                            //     }
                            //     else {
                            //         for (let v of THEEL.elInteractions) {
                            //             this.theUIInteractions.push(v);
                            //         }
                            //         innerhtml += '<input type="checkbox" ' +
                            //             'name = "' + THEEL.elID + '" class="' + CC + '"  id="' +
                            //             THEEL.elID + '_' + i.toString() + '" ' +
                            //             'value="' + v + '" onchange="' + eventwirup + '" style="' + THEEL.elFormStyle + '" >';
                            //         innerhtml += '<label for="' + THEEL.elID + '_' + i.toString() + '" class="custom-control-label" >' + v + '</label>';
                            //     }

                            //      // store the ID for Interactivity processing

                            //     this.TheInputIDs.push(THEEL.elID + '_' + i.toString());

                            //     innerhtml += "</div>";
                            // }

                            innerhtml += '</div></div> ';

                            break;


                        }
                    }
                }
            } // end of for (let THEEL of UIElements)

            // close off the '<div class="form-row" >'
            innerhtml += '</div>';
        }

        innerhtml += "</form></div>";

        el.innerHTML = innerhtml;

        // Ok now all of the elements should be in the DOM
        // now we want to iterate over everything again to set any scoring and any required bits
        for (let THEEL of UIElements) {
            switch (THEEL.elType.toUpperCase()) {
                case "TEXT": {

                    var el = <HTMLElement>(document.getElementById(THEEL.elID));

                    if (THEEL.elScore !== undefined && typeof THEEL.elScore[0] === 'undefined' && el !== null && el.dataset["fgscore"] !== undefined) {
                        el.dataset.fgscore = "0";

                    }
                    else if (el !== null && el.dataset["fgscore"] !== undefined) {
                        el.dataset.fgscore = THEEL.elScore[0].toString();
                    }

                    if (THEEL.elRequired && el !== null) {
                        el.dataset.fgrequired = "YES";
                    }
                    else if (el !== null) {
                        el.dataset.fgrequired = "NO";
                    }

                    break;
                }
                case "DATE": {
                    var el = <HTMLElement>(document.getElementById(THEEL.elID));

                    if (THEEL.elScore !== undefined && typeof THEEL.elScore[0] === 'undefined') {
                        el.dataset.fgscore = "0";

                    }
                    else {
                        el.dataset.fgscore = THEEL.elScore[0].toString();
                    }
                    // el.dataset.fgscore = THEEL.elScore[0].toString();

                    if (THEEL.elRequired) {
                        el.dataset.fgrequired = "YES";
                    }
                    else {
                        el.dataset.fgrequired = "NO";
                    }

                    break;

                }
                case "NARRATIVE": {
                    var el = <HTMLElement>(document.getElementById(THEEL.elID));

                    if (THEEL.elScore !== undefined && typeof THEEL.elScore[0] === 'undefined') {
                        el.dataset.fgscore = "0";

                    }
                    else {
                        el.dataset.fgscore = THEEL.elScore[0].toString();
                    }
                    // el.dataset.fgscore = THEEL.elScore[0].toString();

                    if (THEEL.elRequired) {
                        el.dataset.fgrequired = "YES";
                    }
                    else {
                        el.dataset.fgrequired = "NO";
                    }

                    break;
                }
                case "RADIO": {

                    let i = 0;
                    for (let v of THEEL.elScore) {
                        i += 1;

                        var el = <HTMLElement>(document.getElementById(THEEL.elID + '_' + i.toString()));

                        if (el !== null) {
                            if (el !== null) { el.dataset.fgscore = v.toString(); }

                            if (THEEL.elRequired && el !== null) {
                                el.dataset.fgrequired = "YES";
                            }
                            else if (el !== null) {
                                el.dataset.fgrequired = "NO";
                            }
                        }
                    }

                    break;
                }
                case "DROPDOWN": {

                    let i = 0;
                    for (let v of THEEL.elScore) {
                        i += 1;

                        var ell = <HTMLOptionElement>(document.getElementById(THEEL.elID + '_' + i.toString()));
                        if (ell !== null) {
                            ell.dataset.fgscore = v.toString();

                            if (THEEL.elRequired) {
                                ell.dataset.fgrequired = "YES";
                            }
                            else {
                                ell.dataset.fgrequired = "NO";
                            }
                        }
                    }

                    break;
                }
                case "CHECKBOX": {

                    let i = 0;
                    for (let v of THEEL.elScore) {
                        i += 1;

                        var el = <HTMLElement>(document.getElementById(THEEL.elID + '_' + i.toString()));

                        if (el !== null) {
                            el.dataset.fgscore = v.toString();

                            if (THEEL.elRequired) {
                                el.dataset.fgrequired = "YES";
                            }
                            else {
                                el.dataset.fgrequired = "NO";
                            }
                        }
                    }

                    break;
                }
                case "RECXOFY": {
                    // here we want to wire up the event handlers for the new yecords

                    var SPANELEMENT = document.getElementById("span_" + THEEL.elID);

                    SPANELEMENT.addEventListener('click', this.TestModalCrap);

                    break;
                }

            }

        }

        // So we have something to be able to notify other controls where to pickup
        // for TAB ORDER
        this.TheCurrentNumberOfInputElements = InputElementTabCount;
    }

    public GetHighestTabOrderCurrently() {
        return this.TheCurrentNumberOfInputElements;
    }

    setData(VersionString, DomElementID, JSobjectName, UIElements: UIElement[]){
        FormGenBS.theVersionString = VersionString;
        this.theContainer = DomElementID;
        this.JSOBJECTNAME = JSobjectName;
        this.HydrateForm(UIElements);
        this.DOINTERACTION = function (e: any) { this.DoFormGenInteraction(e); }
    }

    public EvaluateTRACKS() {
        // Iterate over all of the UIInteractions stored
        for (let UIi of this.theUIInteractions) {
            if (UIi.elInteractionType === "TRACK") {
                // we have a tracking UIi so lets decode it
                for (let THEEL of FormGenBS.theUIElements) {

                    if (THEEL.elID === UIi.elIDSource) {
                        // we have the actual User Interface control that is the source for this TRACKING
                        var v = new UIValue(THEEL.elID, "");

                        switch (THEEL.elType.toUpperCase()) {
                            case "TEXT":
                                {
                                    var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                                    v = new UIValue(THEEL.elID, el.value);

                                    break;
                                }
                            case "DATE":
                                {
                                    var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                                    v = new UIValue(THEEL.elID, el.value);

                                    break;
                                }
                            case "NARRATIVE":
                                {
                                    var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                                    var tv = el.value;

                                    var v = new UIValue(THEEL.elID, tv);

                                    break;
                                }
                            case "RADIO":
                                {
                                    let i = 0;

                                    for (let vv of THEEL.elContent) {
                                        i += 1;

                                        var theid = THEEL.elID + "_" + i.toString();

                                        var el = <HTMLInputElement>(document.getElementById(theid));

                                        if (el.checked) {
                                            v = new UIValue(THEEL.elID + "_" + i.toString(), "true");
                                        }
                                        else {
                                            v = new UIValue(THEEL.elID + "_" + i.toString(), "false");
                                        }

                                        if (v.uivID === UIi.elIDSource) {
                                            break;
                                        }
                                    }

                                    break;
                                }
                            case "DROPDOWN":
                                {
                                    var eli = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                                    v = new UIValue(THEEL.elID, eli.options[eli.selectedIndex].text);

                                    break;
                                }
                            case "CHECKBOX":
                                {
                                    let i = 0;

                                    for (let vv of THEEL.elContent) {
                                        i += 1;

                                        var theid = THEEL.elID + "_" + i.toString();

                                        var el = <HTMLInputElement>(document.getElementById(theid));

                                        if (el.checked) {
                                            v = new UIValue(THEEL.elID + "_" + i.toString(), "true");
                                        }
                                        else {
                                            v = new UIValue(THEEL.elID + "_" + i.toString(), "false");
                                        }

                                        if (v.uivID === UIi.elIDSource) {
                                            break;
                                        }

                                    }

                                    break;
                                }
                        }

                        // Now v should contain a UIVALUE that we can look at to see if it matches the TRACK and if so we can
                        // set said value

                        if (v.uivValue === UIi.elValueTrigger) {
                            // We have a match

                            var eel = <HTMLInputElement>(document.getElementById(UIi.elIDTarget));

                            eel.value = UIi.elValueTracker;

                        }

                        break;
                    }
                }
            }
        }
    }

    /**
     * SetElementValueEcho
     *
     * @param elid The ELID of the element to be adjusted
     * @param valecho The True or False setting for this element on getformdata
     */
    public SetElementValueEcho(elid: string, valecho: boolean)
    {
        for (let THEEL of FormGenBS.theUIElements) {
            if (THEEL.elID === elid)
            {
                THEEL.elValueEcho = valecho;
            }
        }
    }

    /**
     * GetFormData
     *
     * @returns UIValue[] of the forms current answers to the question elements on the current form
     */
    public static GetFormData() {
        var UIValues: UIValue[] = [];

        // first we want to echo the version as one of the elements

        var theversion = new UIValue("FORMVERSIONSTRING", FormGenBS.theVersionString + "");

        UIValues.push(theversion);

        //this.EvaluateTRACKS();

        for (let THEEL of FormGenBS.theUIElements) {
            if (THEEL.elValueEcho) {
                switch (THEEL.elType.toUpperCase()) {
                    case "TEXT":
                        {
                            var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                            var v = new UIValue(THEEL.elID, el.value);

                            UIValues.push(v);

                            break;
                        }
                    case "DATE":
                        {
                            var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                            var v = new UIValue(THEEL.elID, el.value);

                            UIValues.push(v);

                            break;
                        }
                    case "NARRATIVE":
                        {
                            var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                            var tv = el.value;

                            // tv.replace('\\','\\\\'); // Excape NewLines and other control characters

                            var v = new UIValue(THEEL.elID, tv);

                            UIValues.push(v);

                            break;
                        }
                    case "RADIO":
                        {
                            let i = 0;

                            for (let vv of THEEL.elContent) {
                                i += 1;

                                var theid = THEEL.elID + "_" + i.toString();

                                var el = <HTMLInputElement>(document.getElementById(theid));

                                if (el.checked) {
                                    var v = new UIValue(THEEL.elID + "_" + i.toString(), "true");

                                    UIValues.push(v);
                                }
                                else {
                                    var v = new UIValue(THEEL.elID + "_" + i.toString(), "false");

                                    UIValues.push(v);
                                }
                            }

                            break;
                        }
                    case "DROPDOWN":
                        {
                            var eli = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                            var v = new UIValue(THEEL.elID, eli.options[eli.selectedIndex].text);

                            UIValues.push(v);

                            break;
                        }
                    case "CHECKBOX":
                        {
                            let i = 0;

                            for (let vv of THEEL.elContent) {
                                i += 1;

                                var theid = THEEL.elID + "_" + i.toString();

                                var el = <HTMLInputElement>(document.getElementById(theid));

                                if (el.checked) {
                                    var v = new UIValue(THEEL.elID + "_" + i.toString(), "true");

                                    UIValues.push(v);
                                }
                                else {
                                    var v = new UIValue(THEEL.elID + "_" + i.toString(), "false");

                                    UIValues.push(v);
                                }
                            }

                            break;
                        }
                }
            }
        }
        return UIValues;
    }

    /**
     * GetFormDataAsString
     *
     * @returns JSON.Stringify() result of the GetFormData() method.
     */
    public GetFormDataAsString() {
        return JSON.stringify(FormGenBS.GetFormData());
    }

    /**
     * GetFormDefinition
     *
     * @returns a UIElement[] of the forms current content for its definition.
     */
    public GetFormDefinition() {
        return FormGenBS.theUIElements;
    }

    /**
     * GetFormDefinitionAsString
     * Returns the JSON.Stringify() result of the GetFormDefinition() call.
     * Used to save a forms definition elsewhere so it can restored with a call to SetFormDefinition().
     *
     * @returns JSON.Stringify() array of UIElements
     */
    public GetFormDefinitionAsString() {
        return JSON.stringify(this.GetFormDefinition());
    }

    /**
     * SetFormDefinition
     * @param TheFormDefinitionAsString: string
     *
     * Takes a JSON.Stringify result of the GetFormDefinition() call and rehydrates the form to restore its content.
     */
    public SetFormDefinition(TheFormDefinitionAsString: string) {
        var Self = this;
        Self.HydrateForm(JSON.parse(TheFormDefinitionAsString));
    }

    /**
     * SetFormDefinitionFromObject
     * @param UIElementArray: UIElement[]
     *
     * Takes an array of UUElements and applys that to the forms definition overwriting the existing forms definition
     */
    public SetFormDefinitionFromObject(UIElementArray: UIElement[]) {
        var Self = this;
        Self.HydrateForm(UIElementArray);
    }

    /**
     * GetFormDefinitionFrom
     * @param webUrl: string
     * Attempts to do a simple GET from the supplied URL to fetch the definition for a form as a JSON.Stringify()
     * result of an array of UIElements. Used to fetch forms definition from webservice endpoints.
    */
    public GetFormDefinitionFrom(webUrl: string) {
        // Will attempt to populate the for by doung an HTTP GET from the webUrl

        var Self = this;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                Self.HydrateForm(JSON.parse(this.responseText));
            }
        };
        xmlhttp.open('GET', webUrl);
        xmlhttp.send();
    }

    /**
     * GetWholeFormFrom
     * @param webUrl: string
     * Attempts to do a simple GET from the supplied URL to fetch the definition and the data for a completed form from
     * the supplied WEBURL
    */
    public GetWholeFormFrom(webUrl: string) {
        // Will attempt to populate the for by doung an HTTP GET from the webUrl

        var Self = this;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                Self.SetWholeForm(this.responseText);
            }
        };
        xmlhttp.open('GET', webUrl);
        xmlhttp.send();
    }

    /**
     * GetRoAtYCoordinate
     * @param YCord
     */
    public GetRowAtYCoordinate(YCord: number) {
        var x = document.getElementsByClassName("form-row");
        var Row = 0;
        var THeight = 0;
        var i = 0;

        for (i = 0; i < x.length; i++) {

            console.log("Iterating through Row " + i + " Height " + (<HTMLElement>x[i]).offsetHeight);

            THeight += (<HTMLElement>x[i]).offsetHeight;
            if (THeight > YCord && (<HTMLElement>x[i]).offsetHeight > 0) {
                Row = i + 1;
                break;
            }

        }

        console.log("Returned ROW " + Row);
        return Row;
    }

    /**
     * SetFormData
     *  @param UIValues: UIValue[]
     */
    public SetFormData(UIValues: UIValue[]) {

        // look for the  version string first and set it

        for (let uivs of UIValues) {
            if (uivs.uivID.toLocaleUpperCase() === "FORMVERSIONSTRING") {
                FormGenBS.theVersionString = uivs.uivValue;
                break;
            }
        }

        for (let THEEL of FormGenBS.theUIElements) {
            switch (THEEL.elType.toUpperCase()) {
                case "TEXT":
                    {
                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        for (let theval of UIValues) {
                            if (theval.uivID === THEEL.elID) {
                                el.value = theval.uivValue;
                                this.DoFormGenInteraction(el);
                                break;
                            }
                        }

                        break;
                    }
                case "DATE":
                    {
                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        for (let theval of UIValues) {
                            if (theval.uivID === THEEL.elID) {
                                el.value = theval.uivValue;
                                this.DoFormGenInteraction(el);
                                break;
                            }
                        }

                        break;
                    }
                case "NARRATIVE":
                    {
                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        for (let theval of UIValues) {
                            if (theval.uivID === THEEL.elID) {
                                el.value = theval.uivValue;
                                this.DoFormGenInteraction(el);
                                break;
                            }
                        }

                        break;
                    }
                case "RADIO":
                    {
                        let i = 0;

                        for (let vv of THEEL.elContent) {
                            i += 1;

                            var el = <HTMLInputElement>(document.getElementById(THEEL.elID + "_" + i.toString()));

                            for (let theval of UIValues) {
                                if (theval.uivID === el.id) {
                                    if (theval.uivValue.toUpperCase() === "TRUE") {
                                        el.checked = true;
                                    }
                                    else {
                                        el.checked = false;
                                    }
                                    this.DoFormGenInteraction(el);

                                    break;
                                }
                            }
                        }

                        break;
                    }
                case "DROPDOWN":
                    {
                        var ell = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                        for (let theval of UIValues) {
                            if (theval.uivID === THEEL.elID) {

                                let i = 1;

                                for (let vv of THEEL.elContent) {
                                    if (theval.uivValue === vv) {
                                        ell.selectedIndex = i;
                                        break;
                                    }
                                    i += 1;
                                }
                                this.DoFormGenInteraction(ell);

                                break;
                            }
                        }
                        break;
                    }
                case "CHECKBOX":
                    {
                        let i = 0;

                        for (let vv of THEEL.elContent) {
                            i += 1;

                            var el = <HTMLInputElement>(document.getElementById(THEEL.elID + "_" + i.toString()));

                            for (let theval of UIValues) {
                                if (theval.uivID === el.id) {
                                    if (theval.uivValue.toUpperCase() === "TRUE") {
                                        el.checked = true;
                                    }
                                    else {
                                        el.checked = false;
                                    }
                                    this.DoFormGenInteraction(el);

                                    break;
                                }
                            }
                        }

                        break;
                    }
            }
        }
    }

    /**
     * SetFormVersion
     * @param versionstring: string
     */
    public SetFormVersion(versionstring: string) {
        FormGenBS.theVersionString = versionstring;
    }

    /**
     * GetFormVersion
     */
    public GetFormVersion() {
        return FormGenBS.theVersionString + "";
    }

    /**
     * SetFormDataFromString
     *  @param theString: string
     *
     * Takes a JSON serialization (Stringify) of an array of UIValue elements and attempts to apply
     * the vakues to the current form. Used to restore a forms entries gathered by a call to
     * GetFormDataAsString()
     */
    public SetFormDataFromString(theString: string) {

        var v = <UIValue[]>(JSON.parse(theString));

        this.SetFormData(v);
    }

    /**
     * SetFormScore
     *
     * will attempt to set the value of a field with the ID of ElToHoldTheScore
     * to the value of the supplied score argument
     * @param ElToHoldTheScore: string
     * @param score: number
     * 
     */
    public SetFormScore(ElToHoldTheScore: string, score: number)
    {
        var el = <HTMLInputElement>(document.getElementById(ElToHoldTheScore));

        if(el!== null)
        {
            el.value = score.toString();
        }
    }

    /**
     * GetFormScore
     *
     * Walks the forms content and for elements that had a weight to be applied to them in the SCORE Array for the element will
     * calculate the SUM score
     *
     * @return score as a number.
     */
    public GetFormScore() {

        var score: number = 0;

        for (let THEEL of FormGenBS.theUIElements) {
            switch (THEEL.elType.toUpperCase()) {
                case "TEXT":
                    {
                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        if (el.value !== "") {
                            // var v = Number(el.dataset.fgscore);
                            var v = Number(THEEL.elScore[0]);
                            if (isNaN(v))
                                v = 0;

                            score += v;
                        }

                        break;
                    }
                case "DATE":
                    {
                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        if (el.value !== "") {
                            // var v = Number(el.dataset.fgscore);
                            var v = Number(THEEL.elScore[0]);
                            if (isNaN(v))
                                v = 0;

                            score += v;
                        }

                        break;
                    }
                case "NARRATIVE":
                    {
                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        if (el.value !== "") {
                            // var v = Number(el.dataset.fgscore);
                            var v = Number(THEEL.elScore[0]);
                            if (isNaN(v))
                                0;

                            score += v;
                        }

                        break;
                    }
                case "RADIO":
                    {
                        let i = 0;

                        for (let vv of THEEL.elContent) {
                            i += 1;

                            var theid = THEEL.elID + "_" + i.toString();

                            var el = <HTMLInputElement>(document.getElementById(theid));

                            if (el.checked) {
                                // var v = Number(el.dataset.fgscore);
                                var v = Number(THEEL.elScore[i-1]);
                                if (isNaN(v))
                                    v = 0;
                                score += v;
                            }

                        }

                        break;
                    }
                case "DROPDOWN":
                    {
                        var eli = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                        var seltext = eli.options[eli.selectedIndex].text;

                        let i = 0;

                        for (let vv of THEEL.elContent) {
                            i += 1;

                            if (vv === seltext) {
                                var eli1 = <HTMLOptionElement>(document.getElementById(THEEL.elID + '_' + i.toString()));

                                // var v = Number(eli1.dataset.fgscore);
                                var v = Number(THEEL.elScore[i-1]);

                                if (isNaN(v))
                                    v = 0;

                                score += v;

                                break;

                            }
                        }

                        break;
                    }
                case "CHECKBOX":
                    {
                        let i = 0;

                        for (let vv of THEEL.elContent) {
                            i += 1;

                            var theid = THEEL.elID + "_" + i.toString();

                            var el = <HTMLInputElement>(document.getElementById(theid));

                            if (el.checked) {
                                // var v = Number(el.dataset.fgscore);
                                var v = Number(THEEL.elScore[i-1]);
                                if (isNaN(v))
                                    v = 0;
                                score += v;
                            }

                        }

                        break;
                    }
            }
        }

        return score;
    }
    
    /**
     * calculateHeightInInches
     *
     * 
     *   @Newheight return Newheight as a number.
     *   @param ElToHoldTheHeight: string
     *   @param ElToHoldTheHightLb: string
     *   @param inches: string
     *   @param height: string
     *   @param age: number
     *   @param Heightvaluehtml: string
     *   @param HeightChildvaluehtml: string
     *   @param Heightvaluehtml: string
     *   @param member_type: string
     */
   public DocalculateHeightInInches(ElToHoldTheHeight: string, ElToHoldTheHightLb: string, inches: string, height: string, age: number ,
    HeightAdultvaluehtml: string, HeightChildvaluehtml: string, member_type: string) {
        var Newheight: number = 0;
        var Newinches: number = 0;
        //var height: string = '';
        var heightIn: string= '';
        var heightInResult: string= '';
        
        let Heightvalue;
        var heightInInches: number = 0;
        var heightele = (<HTMLSelectElement>document.getElementById(ElToHoldTheHeight));
        var heightlabel = document.getElementById(ElToHoldTheHightLb);
        if (heightele !== null) {
            var Inchvalue = heightele.value;
            if (Inchvalue === '') {
                inches = '';
            }

        }
        if (age >= 18) {
            const Heightvaluehtml = <HTMLSelectElement>document.getElementById(HeightAdultvaluehtml);
            Heightvalue = Heightvaluehtml.value;

        } else {
            const Heightvaluehtml = <HTMLSelectElement>document.getElementById(HeightChildvaluehtml);
            // @ts-ignore
            if (Heightvaluehtml !== null) {
                Heightvalue = Heightvaluehtml.value;
            }
        }
        if (Heightvalue === '') {
            height = '';
        }
        if ( height !== undefined && height !== '') {
            Newheight = (Number(height) * 12);
        }
        if  (inches !== undefined && inches !== '') {
            Newinches = Number(inches);
        }
        if (Newheight !== undefined && Newinches !== undefined) {
            Newheight = Newheight + Newinches;
        }
        if (member_type === 'Pediatric') {
            heightIn = ' <label style="display:inline;">What is your child\'s height?</label>';
        } else {
            heightIn = ' <label style="display:inline;">What is your height?</label>';
        }
        if (Newheight !== undefined && Newheight !== 0) {
            heightInResult = ' <span style="margin:0 5px; font-size:14px;font-style:italic;display:inline;border-radius:4px;' +
                ' padding: 2px 8px;;border:1px ridge lightgrey;">Calculated Height = '
                + Newheight + ' inches </span>';
        }
        if (heightlabel !== null) {
            if (Newheight !== undefined && Newheight !== null && Newheight !== 0) {
                heightlabel.innerHTML = heightIn + heightInResult + (' ');
            } else {
                heightlabel.innerHTML = heightIn + (' ');
            }
        }

        heightInInches = Number(Newheight);
        return Newheight;
    }

    /**
     * IsFormValid
     *
     * Walks the forms contents and seeks to apply simple valitity rules to the contained elements
     * I.E. Text field have something in them, Radio and Checkbox button groups have something selected,
     * Dropdowns have something selected, Dates have a selected value. This based on if the forms
     * definition indicated that the element was required. Will engage HTML highlighting on invalid
     * items
     *
     * @returns Boolean validity indication True or False
     */
    public IsFormValid() {

        var isvalid: boolean = true;

        for (let THEEL of FormGenBS.theUIElements) {
            if (THEEL.elRequired) {
                switch (THEEL.elType.toUpperCase()) {
                    case "TEXT":
                        {
                            var del = <HTMLElement>(document.getElementById("div_" + THEEL.elID));
                            
                            if (del.clientHeight> 0)
                            {
                            
                                if (THEEL.elInitialVisibility) { //(!del.hidden) {

                                    var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                                    el.classList.remove('is-invalid');
                                    el.classList.remove('is-valid');


                                    if (el.value + "" === "") {
                                        isvalid = false;

                                        // el.classList.add('.was-validated');
                                        el.classList.add('is-invalid');

                                    }
                                    else {
                                        // el.classList.add('.was-validated');
                                        // el.classList.add(':valid');
                                    }
                                }
                            }
                            break;
                        }
                    case "DATE":
                        {
                            var del = <HTMLElement>(document.getElementById("div_" + THEEL.elID));

                            if (del.clientHeight> 0)
                            {
                                if (!del.hidden) {

                                    var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                                    el.classList.remove('is-invalid');
                                    el.classList.remove('is-valid');

                                    if (el.value + "" === "") {
                                        isvalid = false;

                                        el.classList.add('is-invalid');

                                    }
                                }
                            }
                            break;
                        }
                    case "NARRATIVE":
                        {
                            var del = <HTMLElement>(document.getElementById("div_" + THEEL.elID));

                            if(del.clientHeight> 0)
                            {
                                if (!del.hidden) {

                                    var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                                    el.classList.remove('is-invalid');
                                    el.classList.remove('is-valid');

                                    if (el.value + "" === "") {
                                        isvalid = false;

                                        el.classList.add('is-invalid');

                                    }
                                }
                            }
                            break;
                        }
                    case "RADIO":
                        {
                            var del = <HTMLElement>(document.getElementById("div_" + THEEL.elID));

                            if (del.clientHeight>0 )
                            {

                                if (!del.hidden) {

                                    let i = 0;

                                    let newvalid = false;

                                    for (let vv of THEEL.elContent) {
                                        i += 1;

                                        var theid = THEEL.elID + "_" + i.toString();

                                        var el = <HTMLInputElement>(document.getElementById(theid));

                                        if (el.checked) {
                                            newvalid = true;
                                        }

                                    }

                                    if (isvalid && !newvalid) {
                                        isvalid = newvalid;


                                    }

                                    i = 0;

                                    for (let vv of THEEL.elContent) {
                                        i += 1;

                                        var theid = THEEL.elID + "_" + i.toString();

                                        var el = <HTMLInputElement>(document.getElementById(theid));

                                        el.classList.remove('is-invalid');
                                        el.classList.remove('is-valid');

                                        if (!newvalid) {
                                            el.classList.add("is-invalid");
                                        }

                                    }

                                }
                            }
                            break;
                        }
                    case "DROPDOWN":
                        {
                            var del = <HTMLElement>(document.getElementById("div_" + THEEL.elID));
                            if (del.clientHeight>0)
                            {
                                if (!del.hidden ) {

                                    var eli = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                                    eli.classList.remove('is-invalid');
                                    eli.classList.remove('is-valid');


                                    var seltext = eli.options[eli.selectedIndex].text;
                                    
                                    if (seltext + "" === "" || seltext.toUpperCase() === "PLEASE SELECT") {
                                        isvalid = false;

                                        eli.classList.add("is-invalid");
                                    }
                                }
                            }
                            break;
                        }
                    case "CHECKBOX":
                        {
                            var del = <HTMLElement>(document.getElementById("div_" + THEEL.elID));

                            if (del.clientHeight>0)
                            {

                                if (!del.hidden) {

                                    let i = 0;

                                    let newvalid = false;

                                    for (let vv of THEEL.elContent) {
                                        i += 1;

                                        var theid = THEEL.elID + "_" + i.toString();

                                        var el = <HTMLInputElement>(document.getElementById(theid));

                                        if (el.checked) {
                                            newvalid = true;
                                        }

                                    }

                                    if (isvalid && !newvalid) {
                                        isvalid = newvalid;


                                    }

                                    i = 0;

                                    for (let vv of THEEL.elContent) {
                                        i += 1;

                                        var theid = THEEL.elID + "_" + i.toString();

                                        var el = <HTMLInputElement>(document.getElementById(theid));

                                        el.classList.remove('is-invalid');
                                        el.classList.remove('is-valid');

                                        if (!newvalid) {
                                            el.classList.add("is-invalid");
                                        }
                                    }
                                }
                            }
                            break;
                        }
                }
            }
        }

        // /**Validation for Dropdowns */
        for (let THEEL of FormGenBS.theUIElements) {
            if (THEEL.elRequired === true) {
                const id = THEEL.elID;
                
                if (THEEL.elType.toUpperCase() === 'DROPDOWN') {
                    const html = <HTMLInputElement>document.getElementById(id);
                    const htmlname = document.getElementsByName(id);

                    if (html !== null) {
                        if (html.value === '') {
                            html.classList.add('is-invalid');
                        } else {
                            html.classList.remove('is-invalid');
                            for (let ddval = 0; ddval < htmlname.length; ddval++) {
                                htmlname[ddval].classList.remove('is-invalid');
                            }
                        }
                    }
                } 
            }
        }
        return isvalid;
    }

    /**
     * GetWholeForm
     *      Returns the JSON.stringify of a FormGenDefCon object representing
     *      The Forms current definition with all of its controls and interactions
     *      The Forms current answers made by the user of the forms
     *
     * Used to persist the data of the current forms state in cases where we want to save completed forms for example.
     * leverages the existing sub calls that get Forms definition and the answers seperately so as they are augmented
     * this will also carry those augmentations automatically
     *
     * @returns FormGenDefCon object that has been serialized into a simple string
     *
     */
    public GetWholeForm() {

        var TheForm: FormGenDefCon = new FormGenDefCon("", "");

        TheForm.FGDFDefinition = this.GetFormDefinitionAsString();
        TheForm.FGDFContent = this.GetFormDataAsString();

        return JSON.stringify(TheForm);

    }

    /**
     * SetWholeForm
     * @param TheFormDefCon
     *      Takes a JSON.Stringify of a FormGenDefCon object and rehydrates a forms definition and fills in the answers
     *      entered into that forms definition in one fell swoop
     *
     * used to rehydrate both a forms content and the answerd entered into that content and is essentially the reverse
     * of the GetWholeForm method above.
     * leverages the existing sub calls that set Forms definition and fills answers seperately so as they are augmented
     * this will also carry those augmentations automatically
     *
     */
    public SetWholeForm(TheFormDefCon: string) {
        var TheForm: FormGenDefCon = new FormGenDefCon("", "");
        TheForm = JSON.parse(TheFormDefCon);

        this.SetFormDefinition(TheForm.FGDFDefinition);

        this.AllowInteractions = false;

        this.SetFormDataFromString(TheForm.FGDFContent);

        this.AllowInteractions = true;

        this.DoFormGenInteraction('');
    }

    /**
     * ClearFormValidityVisuals
     *
     * Will clear the elemet validity cue's applied tothe forms visuals by IsFormValid()
     */
    public ClearFormValidityVisuals() {
        for (let THEEL of FormGenBS.theUIElements) {
            switch (THEEL.elType.toUpperCase()) {
                case "TEXT":
                case "DATE":
                case "NARRATIVE":

                    {

                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));
                        el.classList.remove('is-invalid');
                        el.classList.remove('is-valid');


                        break;
                    }
                case "RADIO":
                case "CHECKBOX":
                    {

                        let i = 0;
                        for (let vv of THEEL.elContent) {
                            i += 1;

                            var theid = THEEL.elID + "_" + i.toString();

                            var el = <HTMLInputElement>(document.getElementById(theid));

                            el.classList.remove('is-invalid');
                            el.classList.remove('is-valid');

                        }

                        break;
                    }
                case "DROPDOWN":
                    {
                        var eli = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                        eli.classList.remove('is-invalid');
                        eli.classList.remove('is-valid');

                        break;
                    }

            }

        }

    }

    /**
     * DoFormGenInteraction
     * @param e HtmlElement that triggered the event or empty string
     *
     * Walks the interaction tree and engages all interaction logic based on values entered into the current form
     */
    public DoFormGenInteraction(e) {

        if (this.AllowInteractions) {

            // first off lets process the TRACK interactions

            this.EvaluateTRACKS();

            for (let INPUTIDELEMENT of this.TheInputIDs) {

                e = document.getElementById(INPUTIDELEMENT);

                for (let UIi of this.theUIInteractions) {
                    // parse each noted interaction to see if we need to act on it

                    if (UIi.elInteractionType === "TRACK") {
                        // we want to skip tracking elements for now
                        // console.log(UIi);

                    }
                    else { // here we will process all the other UIinteraction types

                        // Change from Explicit eq to implicit eq to fix stupid 
                        // Data issues IE === became ==
                        if (e.name == UIi.elIDSource) {

                            switch (e.type.toUpperCase()) {
                                case "RADIO":
                                case "CHECKBOX":
                                    {
                                        var radios = document.getElementsByName(e.name);

                                        var showit = false;

                                        var thetriggeredelement = document.getElementById("div_" + UIi.elIDTarget);

                                        console.log(thetriggeredelement);
                                                                                
                                        for (let i = 0; i < radios.length; i++) {
                                            var it = (<HTMLInputElement>radios[i]);

                                            if (it.value === UIi.elValueTrigger || it.hidden) {
                                               
                                                if (it.checked && UIi.elInteractionType === "SHOW") {
                                                    // we are gonna make sure something is visible

                                                    showit = true;

                                                    thetriggeredelement.style.display = "";// "block";

                                                    // Try to break out of showing should allow multiple 
                                                    // checkboxes to show an element

                                                    //break;
                                                }
                                                else {
                                                    if (it.checked && UIi.elInteractionType === "HIDE") {
                                                        // we are gonna make sure something is hidden
                                                        thetriggeredelement.style.display = "none";

                                                        // here we want to recursively call itself to propigate UIInteractions down the chain

                                                        // var telement = document.getElementById(UIi.elIDTarget);

                                                        // this.DoFormGenInteraction(telement);
                                                    }
                                                    else {
                                                        if (!it.checked && UIi.elInteractionType === "HIDE") {
                                                            // we are gonna make sure something is visible
                                                            thetriggeredelement.style.display = "";// "block";
                                                        
                                                            // Try to break out of showing should allow multiple 
                                                            // checkboxes to show an element

                                                            //break;

                                                        }
                                                        else {
                                                            // we are gonna make sure something is hidden
                                                            thetriggeredelement.style.display = "none";

                                                            // here we want to recursively call itself to propigate UIInteractions down the chain

                                                            // var telement = document.getElementById(UIi.elIDTarget);

                                                            // this.DoFormGenInteraction(telement);

                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (showit)
                                        {
                                            thetriggeredelement.style.display = "";// "block";
                                        }

                                        break;
                                    }
                                case "TEXT":
                                case "TEXTAREA":
                                    {
                                        var v = e.value.toUpperCase();

                                        var thetriggeredelement = document.getElementById("div_" + UIi.elIDTarget);

                                        if (v === UIi.elValueTrigger.toUpperCase()) {

                                            if (UIi.elInteractionType === "SHOW") {
                                                thetriggeredelement.style.display = "";// "block";
                                            }
                                            else {
                                                if (UIi.elInteractionType === "HIDE") {
                                                    thetriggeredelement.style.display = "none";

                                                    // here we want to recursively call itself to propigate UIInteractions down the chain

                                                    var telement = document.getElementById(UIi.elIDTarget);

                                                    // this.DoFormGenInteraction(telement);
                                                }
                                            }
                                        }
                                        else {
                                            if (UIi.elInteractionType === "SHOW") {
                                                thetriggeredelement.style.display = "none";

                                                // here we want to recursively call itself to propigate UIInteractions down the chain

                                                var telement = document.getElementById(UIi.elIDTarget);

                                                // this.DoFormGenInteraction(telement);
                                            }
                                            else {
                                                if (UIi.elInteractionType === "HIDE") {
                                                    thetriggeredelement.style.display = "";// "block";
                                                }
                                            }
                                        }

                                        break;
                                    }
                                case "DATE":
                                    {
                                        var v = e.value.toUpperCase();

                                        var thetriggeredelement = document.getElementById("div_" + UIi.elIDTarget);

                                        var vis = this.isVisible(e);

                                        if (!vis)
                                            v = "";

                                        if (v !== "") {

                                            if (UIi.elInteractionType === "SHOW") {
                                                thetriggeredelement.style.display = "";// "block";
                                            }
                                            else {
                                                if (UIi.elInteractionType === "HIDE") {
                                                    thetriggeredelement.style.display = "none";

                                                    // e.value = "";

                                                    // here we want to recursively call itself to propigate UIInteractions down the chain

                                                    // var telement = document.getElementById(UIi.elIDTarget);

                                                    // this.DoFormGenInteraction(e);
                                                }
                                            }
                                        }
                                        else {
                                            if (UIi.elInteractionType === "SHOW") {
                                                thetriggeredelement.style.display = "none";

                                                // e.value = "";

                                                // here we want to recursively call itself to propigate UIInteractions down the chain

                                                // var telement = document.getElementById(UIi.elIDTarget);

                                                // this.DoFormGenInteraction(e);
                                            }
                                            else {
                                                if (UIi.elInteractionType === "HIDE") {
                                                    thetriggeredelement.style.display = "";// "block";
                                                }
                                            }
                                        }

                                        break;
                                    }
                                default: // SELECT HANDLED HERE
                                    {
                                        // this will be the select check for dropdowns
                                        if (e.type.toUpperCase().startsWith("SELECT")) {
                                            var v = e.value;

                                            var thetriggeredelement = document.getElementById("div_" + UIi.elIDTarget);

                                            if (v === UIi.elValueTrigger) {

                                                if (UIi.elInteractionType === "SHOW") {
                                                    thetriggeredelement.style.display = "";// "block";
                                                }
                                                else {
                                                    if (UIi.elInteractionType === "HIDE") {
                                                        thetriggeredelement.style.display = "none";

                                                        // here we want to recursively call itself to propigate UIInteractions down the chain

                                                        var telement = document.getElementById(UIi.elIDTarget);

                                                        // this.DoFormGenInteraction(telement);
                                                    }
                                                }
                                            }
                                            else {
                                                // if (UIi.elInteractionType === "SHOW") {
                                                //     thetriggeredelement.style.display = "none";

                                                //     // here we want to recursively call itself to propigate UIInteractions down the chain

                                                //     var telement = document.getElementById(UIi.elIDTarget);

                                                //     //this.DoFormGenInteraction(telement);
                                                // }
                                                // else {
                                                //     if (UIi.elInteractionType === "HIDE") {
                                                //         thetriggeredelement.style.display = "";//"block";
                                                //     }
                                                // }

                                                break;
                                            }
                                        }
                                        break;
                                    }
                            }
                        }
                    }
                }
            }
        }
        // alert("Interacted Here current value of ");
    }

    /**
     * SetReadWrite()
     * @param RW True or False will enumerate the form and set the appropriate attributes for RW
     */
    public SetReadWrite(RW: boolean) {
        for (let THEEL of FormGenBS.theUIElements) {
            switch (THEEL.elType.toUpperCase()) {
                case "TEXT":
                case "DATE":
                case "NARRATIVE":
                    {

                        var el = <HTMLInputElement>(document.getElementById(THEEL.elID));

                        if (RW) {
                            el.removeAttribute('readonly');
                        }
                        else {
                            el.setAttribute('readonly', '');
                        }

                        break;
                    }
                case "RADIO":
                case "CHECKBOX":
                    {
                        let i = 0;
                        for (let vv of THEEL.elContent) {
                            i += 1;

                            var theid = THEEL.elID + "_" + i.toString();

                            var el = <HTMLInputElement>(document.getElementById(theid));

                            if (RW) {
                                el.removeAttribute('disabled');
                            }
                            else {
                                el.setAttribute('disabled', '');
                            }
                        }

                        break;
                    }

                case "DROPDOWN":
                    {
                        var eli = <HTMLSelectElement>(document.getElementById(THEEL.elID));

                        if (RW) {
                            eli.removeAttribute('disabled');
                        }
                        else {
                            eli.setAttribute('disabled', '');
                        }

                        break;
                    }

            }
        }
    }

    /**
     * GreenBarEnabled()
     * Turns on the automatic alternate coloring scheme for renderd rows. The default color LightGreen
     * can be changed by using SetGreenBarColor()
     */
    public GreenBarEnabled() {
        this.EnableGreenbar = true;

        var Self = this;

        Self.HydrateForm(FormGenBS.theUIElements);

    }

    /**
     * GreenBarDisabled()
     * Turns off the automatic alternate coloring scheme for renderd rows.
     */
    public GreenBarDisabled() {
        this.EnableGreenbar = false;

        var Self = this;

        Self.HydrateForm(FormGenBS.theUIElements);
    }

    /**
     * SetGreenBarColor()
     * @param TheColor a string representation of the color to employ for the greenbar coloration. HTML compatable string representation of the color
     *
     */
    public SetGreenBarColor(TheColor: string) {
        this.GreenBarColor = TheColor;

        if (this.EnableGreenbar) {
            var Self = this;

            Self.HydrateForm(FormGenBS.theUIElements);
        }
    }

    public TestModalCrap(e: any) {

        const elem = document.createElement('div') as HTMLDivElement;
        const elem1a = document.createElement('div') as HTMLDivElement;
        const elem1 = document.createElement('div') as HTMLDivElement;
        const elem2 = document.createElement('div') as HTMLDivElement;
        const elem3 = document.createElement('h5') as HTMLHeadingElement;
        const elem4 = document.createElement('button') as HTMLButtonElement;
        const elem5 = document.createElement('span') as HTMLSpanElement;
        const elem6 = document.createElement('div') as HTMLDivElement;

        const TheMainObject = document.getElementById("FormGenBody");

        // First we want to  try to remove the existing Dialog element if one is there

        var elem2Remove = document.querySelector('#FormGenGeneratedModalDialog');

        if (elem2Remove !== null) {
            // Ok we got something so lets give it he axe...

            TheMainObject.removeChild(elem2Remove);
        }

        // Move on now and make a new one and insert it

        elem.id = "FormGenGeneratedModalDialog";
        elem.setAttribute("class", "modal fade");
        // elem.className = "modal fade";
        elem.tabIndex = -1;
        elem.setAttribute("aria-labelledby", "FormGenGeneratedModalDialogLabel");
        elem.setAttribute("aria-hidden", "true");

        elem1.setAttribute("class", "modal-dialog");
        elem1.setAttribute("role", "document");

        elem1a.setAttribute("class", "modal-content");

        elem2.setAttribute("class", "modal-header");

        elem3.setAttribute("class", "modal-title");
        elem3.id = "FormGenGeneratedModalDialogTitle";
        elem3.textContent = "Sample Title Goes Here";

        elem4.setAttribute("class", "close");
        elem4.setAttribute("data-dismiss", "modal");
        elem4.setAttribute("aria-label", "close");

        elem5.setAttribute("aria-hidden", "true");
        elem5.textContent = "X";

        elem6.setAttribute("class", "modal-body");

        if (e !== undefined) {
            elem6.innerHTML = "The body of this dialog will contain<br>a series of input elements<br>that will allow you to fill<br>out a record";
        }
        else {
            elem6.innerHTML = "Sample Body of the dialog will go here";
        }

        // elem6.textContent = "Sample Body of the dialog will go here";

        elem1.appendChild(elem1a);
        elem1a.appendChild(elem2);
        elem2.appendChild(elem3);
        elem2.appendChild(elem4);

        elem4.appendChild(elem5);

        elem1a.appendChild(elem6);

        elem.appendChild(elem1);

        TheMainObject.appendChild(elem);

        // $('#FormGenGeneratedModalDialog').modal('show');

    }

    // use in propigation of UIInteractions on visibiliy checks
    private isVisible(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }

    /**
     * Will take a form and attempt to stuff the value of sesvar from session storage int the
     * HTMLElement whose ID is idval
     * Finally setting it to either be disabled or enabled via the disable boolean
     * @param idval 
     * @param sesvar 
     * @param disable 
     */
    public DoPrePopulate(idval: string, sesvar: string, disable: boolean )
    {
        const prepop = <HTMLInputElement>document.getElementById(idval);
        prepop.value = sessionStorage.getItem(sesvar);
        prepop.disabled = disable;
    }

    // public DoFormPopulateFromUI_StringResult(UI_StringResult: string)
    // {

    //     var answers  = JSON.parse(UI_StringResult);

    //     if (answers !== null) {
    //       for (let a = 0; a < answers.data.length; a++) {
    //         for (let i = 0; i < data.length; i++) {
    //           if (this.answers.data[a].id === this.data[i].elID) {
    //             if (this.data[i].elType.toUpperCase() === 'TEXT' || this.data[i].elType.toUpperCase() === 'NARRATIVE') {
    //               const doc = <HTMLInputElement>document.getElementById('FormGenBody');
    //               const html = <HTMLInputElement>document.getElementById(this.data[i].elID);
    //               html.value = this.answers.data[a].value;

    //             } else if (this.data[i].elType.toUpperCase() === 'DROPDOWN') {
    //               const html = <HTMLInputElement>document.getElementById(this.data[i].elID);
    //               const html2 = document.getElementsByName(this.data[i].elID);
    //               html.value = html2[this.answers.data[a].value].innerText;
    //             } else if (this.data[i].elType.toUpperCase() === 'RADIO') {
    //               for (let i1 = 0; i1 < this.data[i].eloption.length; i1++) {
    //                 if (this.data[i].eloption[i1] === this.answers.data[a].value) {
    //                   const org_option = i1 + 1;

    //                   const html = <HTMLInputElement>document.getElementById(this.data[i].elID + '_' + org_option);
    //                   html.checked = true;
    //                 }
    //               }
    //             } else if (this.data[i].elType.toUpperCase() === 'CHECKBOX') {
    //               if (this.answers.data[a].value !== 'undefined') {
    //                 const options = this.answers.data[a].value.split('| ');
    //                 for (let opt = 0; opt < options.length; opt++) {

    //                   const html = <HTMLInputElement>document.getElementById(this.data[i].elID + '_' + options[opt]);
    //                   if (html !== null) { html.checked = true; }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    // }


    public prepopulate(status) {
        const prepop = <HTMLInputElement>document.getElementById('98');
        prepop.value = sessionStorage.getItem('mbrfrstNm');
        prepop.disabled = true;
        
        const prepopLname = <HTMLInputElement>document.getElementById('99');
        prepopLname.value = sessionStorage.getItem('mbrlstNm');
        prepopLname.disabled = true;
        
        
        const prepopmembId = <HTMLInputElement>document.getElementById('509451');
        prepopmembId.value = sessionStorage.getItem('sid');
        prepopmembId.disabled = true;
    
    }
}

export class UIElement {
    public elFormRow: number;
    public elID: string;
    public elType: string;
    public elLabel: string;
    public elContent: string[];
    public elRequired: boolean;
    public elInteractions: UIInteraction[];
    public elInitialVisibility: boolean;
    public elStyle: string;
    public elLabelStyle: string;
    public elFormStyle: string;
    public elScore: number[];
    public elAutoSize: boolean;
    public elCustomClass: string;
    public elRecords: string[];
    public elValueEcho: boolean;


    constructor(elformrow: number, elid: string, eltype: string, ellabel: string,
                elcontent: string[], elrequired: boolean, elinteractions: UIInteraction[],
                elinitialvisibility: boolean, elstyle: string, ellabelstyle: string,
                elformstyle: string, elscore: number[], elautosize?: boolean,
                elcustomclass?: string, elrecords?: string[], elvalueecho?: boolean) {
        this.elFormRow = elformrow;
        this.elID = elid;
        this.elContent = elcontent;
        this.elLabel = ellabel;
        this.elRequired = elrequired;
        this.elType = eltype;
        this.elInteractions = elinteractions;
        this.elInitialVisibility = elinitialvisibility;
        this.elStyle = elstyle;
        this.elLabelStyle = ellabelstyle;
        this.elFormStyle = elformstyle;
        this.elScore = elscore;


        if (elautosize === undefined) {
            this.elAutoSize = false;
        }
        else {
            this.elAutoSize = elautosize;
        }

        if (elcustomclass === undefined) {
            this.elCustomClass = "";
        }
        else {
            this.elCustomClass = elcustomclass;
        }

        if (elrecords === undefined) {
            this.elRecords = [];
        }
        else {
            this.elRecords = elrecords;
        }

        if (elvalueecho === undefined){
            this.elValueEcho = true;
        }
        else
        {
            this.elValueEcho = elvalueecho;
        }


    }
}

export class UIInteraction {
    public elIDSource: string;
    public elIDTarget: string;
    public elInteractionType: string;
    public elValueTrigger: string;
    public elValueTracker: string;

    constructor(elidsource: string, elidtarget: string, elinteractiontype: string, elvaluetrigger: string, elvaluetracker?: string) {
        this.elIDSource = elidsource;
        this.elIDTarget = elidtarget;
        this.elInteractionType = elinteractiontype;
        this.elValueTrigger = elvaluetrigger;
        this.elValueTracker = elvaluetracker;
    }


}

export class UIValue {
    public uivID: string;
    public uivValue: string;

    constructor(id: string, value: string) {
        this.uivID = id;
        this.uivValue = value;
    }
}

export class FormGenDefCon {
    public FGDFDefinition: string;
    public FGDFContent: string;

    constructor(FGDFD: string, FGDFC: string) {
        this.FGDFDefinition = FGDFD;
        this.FGDFContent = FGDFC;
    }
}
