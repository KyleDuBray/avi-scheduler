import React from "react";
import FilePicker from "./FilePicker";

import "../styles/button.css";

const BUFFER = "$B%UF%F%E%R%$_$%Z%O%N%E$";

class ScheduleLoader extends React.Component {
  state = {
    appts: [],
    curAppt: {},
  };

  extractScheduleArray = (contents) => {
    let wholeStr, normalizedStr, arr;
    if (contents) {
      //console.log(contents);
      // remove HTML tags, replace with buffer
      wholeStr = replaceTagsWithBuffer(contents);
      normalizedStr = wholeStr.replace(/\n/g, " ");
      //console.log(normalizedStr);
      arr = normalizedStr.split(BUFFER);
      //console.log(arr);
      this.mapScheduleArray(arr);
      this.renderSchedule();
    }
  };

  // Maps through stream of string values derived from schedule html
  // document, and filters/categorizes accordingly.
  // Sets state.appts to array of appointment objects used to populate table.
  mapScheduleArray = (scheduleArray) => {
    let lastNameNext = false,
      firstNameNext = false,
      descriptionNext = false,
      appointments = [],
      cur = {};

    scheduleArray.forEach((rawval) => {
      // filter html tags
      const val = rawval.replace(/&nbsp;/g, " ");
      // Tests for having at least one character or is phone number
      // or is empty parentheses, indicating missing phone number
      if (
        /([a-zA-Z])+([ -~])*/.test(val) ||
        isPhoneNumber(val) ||
        val.includes("()")
      ) {
        console.log(val);

        // If last name next and value is not a room designation
        if (
          lastNameNext &&
          val.slice(0, 2) !== "RM" &&
          !val.endsWith("min.") &&
          val !== "DUN" &&
          val !== "CHI" &&
          val !== "SSS"
        ) {
          // - If last name next and a time is given, set current time.
          //    lastNameNext is still true.
          if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9][a-z]$/.test(val)) {
            cur.time = val.replace(":", "").slice(0, -1);
            lastNameNext = true;
          }
          // - else set last name (value was not of time format)
          else {
            cur.lastName = val;
            lastNameNext = false;
          }
        }
        // else if first name next
        else if (firstNameNext) {
          cur.firstName = val;
          firstNameNext = false;
        }
        // else if description next and val not equal to
        // garbage values
        else if (
          descriptionNext &&
          val !== "Ghost" &&
          val !== "Confrmd." &&
          val !== "Left msg."
        ) {
          // - If end of page
          if (val === "Previous Page" || val === "Next Page") {
            cur.description = "***";
          }
          // - else if value is of time format, push early, as no
          //   description was provided.
          //   also need to use the currently read time as time for next
          //   appointment object
          else {
            if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9][a-z]$/.test(val)) {
              console.log("HIT ONE!!!!!!!!!!!");
              cur.description = "***";
              descriptionNext = false;
              appointments.push(cur);
              cur = {};
              cur.time = val.replace(":", "").slice(0, -1);
              lastNameNext = true;
            }
            // - else- real description, set to cur
            else {
              cur.description = val;
              descriptionNext = false;
            }
          }
        }
        // else if time format- set it and reset lastNameNext to true
        else if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9][a-z]$/.test(val)) {
          cur.time = val.replace(":", "").slice(0, -1);
          lastNameNext = true;
        }
        // else if phone number format or includes empty () - indicating phone number missing
        // - triggers firstNameNext to be true
        else if (isPhoneNumber(val) || val.includes("()")) {
          cur.phone = val;
          firstNameNext = true;
        }
        // if value is literally CANINE or FELINE- pass, description still needed
        else if (val === "CANINE" || val === "FELINE") {
          descriptionNext = true;
        }
        // NEW IF- runs on each top level iteration
        // pushes if fields full
        if (this.fieldsFull(cur)) {
          appointments.push(cur);
          cur = {};
        }
      }
    });

    this.setState({ appts: appointments });
  };

  formatFutureAppt = (appt) => {
    return {
      FName: appt.firstName + " " + appt.lastName.split(",")[0],
      FDoctor: "",
      FTime: appt.time,
      FDescription: appt.description,
    };
  };

  fieldsFull = (obj) => {
    let isFull = false;
    if (
      obj.lastName &&
      obj.firstName &&
      obj.description &&
      obj.time &&
      obj.phone
    ) {
      isFull = true;
    }
    return isFull;
  };

  renderSchedule = () => {
    const appointments = this.state.appts.map((appt, index) => {
      return {
        name: appt.firstName + " " + appt.lastName.split(",")[0],
        time: appt.time,
        description: appt.description,
        phone: appt.phone,
        key: index,
      };
    });
    this.props.setParentState(appointments);
  };

  render() {
    return (
      <>
        <FilePicker
          parseSchedule={this.extractScheduleArray}
          class="button-primary"
        ></FilePicker>
      </>
    );
  }
}

// Removes HTML tags from str, replaces with "BUFFER"
const replaceTagsWithBuffer = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, BUFFER);
};

// Returns true if str is phone number format
const isPhoneNumber = (str) =>
  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(str);

export default ScheduleLoader;
