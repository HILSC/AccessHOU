import React from "react";

import {
    isMobile,
  } from 'react-device-detect';

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

// IMAGES
import SearchBar from "../../images/manual/search_bar.PNG";
import ServiceTile from "../../images/manual/service_tile.PNG";
import PrimaryFilters from "../../images/manual/primary_filters.PNG";
import SecondaryFilters from "../../images/manual/secondary_filters.PNG";

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./UserManualPublicStyle";
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <ul className={classes.mainUL}>
            <li>
              <a className={classes.primaryAnchor} href="#intro">
                Introduction
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#services">
                Searching for a Service
              </a>
            </li>
            <ul>
              <li>
                <a className={classes.primaryAnchor} href="#start_search">
                  Starting a search
                </a>
              </li>
              <li>
                <a className={classes.primaryAnchor} href="#search_results">
                  Search results
                </a>
              </li>
              <li>
                <a
                  className={classes.primaryAnchor}
                  href="#filtering_search_results"
                >
                  Filtering search results
                </a>
              </li>
              <ul>
                <li>
                  <a className={classes.primaryAnchor} href="#primary_filters">
                    Primary filters
                  </a>
                </li>
                <li>
                  <a
                    className={classes.primaryAnchor}
                    href="#secondary_filters"
                  >
                    Secondary Filters
                  </a>
                </li>
              </ul>
              <li>
                <a className={classes.primaryAnchor} href="#navigating_results">
                  Navigating results
                </a>
              </li>
            </ul>
            <li>
              <a className={classes.primaryAnchor} href="#editing_services">
                Editing a Service
              </a>
              <ul>
                <li>
                  <a
                    className={classes.primaryAnchor}
                    href="#adding_agencies_programs"
                  >
                    Adding new agencies and programs
                  </a>
                </li>
                <ul>
                  <li>
                    <a className={classes.primaryAnchor} href="#add_agency">
                      Add new agency
                    </a>
                  </li>
                  <li>
                    <a className={classes.primaryAnchor} href="#add_program">
                      Add new program
                    </a>
                  </li>
                </ul>
                <li>
                  <a
                    className={classes.primaryAnchor}
                    href="#edit_agencies_programs"
                  >
                    Editing agencies and programs
                  </a>
                </li>
                <ul>
                  <li>
                    <a className={classes.primaryAnchor} href="#edit_agency">
                      Edit Agency
                    </a>
                  </li>
                  <li>
                    <a className={classes.primaryAnchor} href="#edit_program">
                      Edit Program
                    </a>
                  </li>
                </ul>
              </ul>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#emergency_mode">
                Emergency Mode
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#iiap">
                Informs Immigrant Accessibility Profile
              </a>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <h2 id="intro">Introduction</h2>
          <p>
            A tool from the Houston Immigration Legal Services Collaborative
            (HILSC), designed for advocates working with immigrants in the
            Houston region to help identify services for referral to their
            clients. The data is supplied by five partner agencies from their
            internal referral lists. Those agencies have agreed to use AccessHOU
            as a referral tool moving forward, which means the data will be
            updated as the advocates learn of changes.
          </p>
          <p>
            AccessHOU was also built to capitalize on crowdsourced data. Any
            user can make suggested edits, additions or deletions to agencies or
            programs. Edits will be stored in a queue for quality assurance by
            HILSC staff or partners. Once approved, they will become a part of
            the database.
          </p>
          <p>
            The quality of AccessHOU is dependent on users. Please use the
            search and edit functions regularly, and help democratize data for
            all. For questions, please contact accesshou@houstonimmigration.org.
          </p>
          <h2 id="services">Searching for a Service</h2>
          <h3 id="start_search">Starting a search</h3>
          <p>
            Searching for agencies and programs can be accomplished directly
            from our{" "}
            <a
              href="https://www.accesshou.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              home page
            </a>
            . In the homepage you will be presented with 2 options:
          </p>
          <ol type="1">
            <li>
              <strong>Perform a search based on a search term:</strong>
              <p>
                To conduct a search by using a search term, just type the
                desired word in the search textbox and either click ‘Find Help’
                to the right of the textbox or hit return on your keyboard. The
                search will return all listings with your search term in the
                name or description, but not necessarily as an exact phrase.
              </p>
                {
                  isMobile ? (
                    <img className={classes.mobileImage} src={SearchBar} alt="search-bar" />
                  ) :  <img src={SearchBar} alt="search-bar" />
              }
            </li>
            <li>
              <strong>Perform a search by clicking a service type:</strong>
              <p>
                By clicking any of the service types displayed below the search
                textbox in the homepage, you will be shown all the agencies and
                programs that provide that service. Hover your mouse over the
                type to display a description of the service type.
              </p>
              {
                  isMobile ? (
                    <img className={classes.mobileImage} src={ServiceTile} alt="service-tile" />
                  ) :  <img src={ServiceTile} alt="service-tile" />
              }
            </li>
          </ol>
          <p>
            Whichever search method you use, you will be taken to the results
            page with a listing of all the agencies and programs that match your
            search, or do not have available data to be excluded from it. You
            can further filter the results based on other criteria (
            <a href="#search_results">see below</a>).
          </p>
          <p>
            If you encounter an agency or program with incomplete data that you
            know, please click through to the listing and click “Help complete
            this profile” to link to the{" "}
            <a href="/editor" target="_blank" rel="noopener noreferrer">
              editor
            </a>{" "}
            and add missing data. If you are not able to find an agency or
            program that you know exists, clear filters and search by term. If
            it still does not appear, please
            <a href="/editor" target="_blank" rel="noopener noreferrer">
              {" "}
              add the agency or program
            </a>{" "}
            to share the information with others.
          </p>
          <h3 id="search_results">Search results</h3>
          <p>
            On the search results page you will be shown all agencies and
            programs that match your search . Filters may apply to agency and/or
            program data. Each result is grouped by agency, with the programs
            within that agency that match your criteria listed below.
            <strong>
              If data for the filter you choose is incomplete for any listing it
              will appear in the results, which means the filter may not apply
              to that program but the data is not yet complete enough to refine
              the results.
            </strong>{" "}
            If you encounter this and learn the detailed information from the
            agency, please edit the agency or program to share the information
            with other users.
          </p>
          <p>
            From the search results page you have the option to further filter
            your results using the filters available to you on the page. There
            are 2 types of filters:
          </p>
          <ol type="1">
            <li>
              <strong>Primary filters:</strong>
              <p>These filters are always visible at the top of the page</p>
              {
                  isMobile ? (
                    <img className={classes.mobileImage} src={PrimaryFilters} alt="primary-filters" />
                  ) :  <img src={PrimaryFilters} alt="primary-filters" />
              }
            </li>
            <li>
              <strong>Secondary filter:</strong>
              <p>
                Additional filters that are shown by clicking ‘Filters’ in the
                search bar.
              </p>
              {
                  isMobile ? (
                    <img className={classes.mobileImage} src={SecondaryFilters} alt="secondary-filters" />
                  ) :  <img src={SecondaryFilters} alt="secondary-filters" />
              }
            </li>
          </ol>
          <h3 id="filtering_search_results">Filtering search results</h3>
          <h4 id="primary_filters">Primary filters</h4>
          <strong>Search Textbox (applies to agency and program)</strong>
          <p>
            Further filter your results by using a search term in this textbox.
            For example, if you searched for a service category and vaguely
            remember that the program you intend to find had “Respect” in their
            name, you could add that word to the box and only agencies and
            programs with that term will be shown.
          </p>
          <strong>HILSC Verified (agency and program)</strong>
          <p>
            Selected by default on all searches. HILSC verified means that the
            information shown for a given program or agency has been accounted
            for by HILSC staff or partners. Unchecking this filter, will show
            you agencies and programs that have not been accounted for by HILSC
            staff, but have been added by the general public.
          </p>
          <strong>Service Type (program)</strong>
          <p>Select one or more service type at the same time, including .</p>
          <strong>Immigration Status (agency and program)</strong>
          <p>
            Choose from immigration status requirements an agency/program may
            have. This is a priority for AccessHOU, given that it is a database
            built for immigrant advocates.
          </p>
          <strong>Filters</strong>
          <p>
            Displays all the secondary filters available including: zip code,
            radius from zip code, annual median income requirements, immigrant
            accessibility profile, if walk in hours are available, program
            languages, and whether a facility is ADA accessible
          </p>
          <strong>Clear</strong>
          <p>
            Clears all the filters selections -- with the exception of HILSC
            Verified which is set to true by default -- and hides the secondary
            filters.
          </p>
          <h4 id="secondary_filters">Secondary Filters</h4>
          <strong>Zip Code / Radius (applies to agency and program)</strong>
          <p>
            The Zip Code filter can be used on its own or be combined with the
            Radius filter. On its own Zip code only agencies/programs located on
            that zip code will be part of the results. Combined with the Radius
            filter, it will show agencies/programs within the selected radius
            range from the zip code.
          </p>
          <strong>Annual Median Income (program)</strong>
          <p>
            Refine by AMI served from percentages in the dropdown menu,
            including: all, less than 80%, less than 110% or less than 140%.
            There are more refined categories within each program, but these
            ranges encompass those.
          </p>
          <strong>Immigrant Accessibility Profile (agency and program)</strong>
          <p>
            The Immigrant accessibility profile is a tool designed by HILSC to
            highlight agencies and programs that not only are highly accessible
            to immigrants regardless of legal status, but also have complete
            information within this database. The data which contributes to
            immigrant accessibility profile completeness includes: 1) Agency --
            IDs accepted (current and expired), proof of address required,
            website languages, interpretation available, assistance to fill out
            intake forms, visual aids for low-literacy clients, agency policy to
            respond to ICE requests, and staff cultural competency training; 2)
            Program -- program languages, services available same day as intake,
            program schedule, and client consultation before completing
            paperwork; 3) Agency and Program -- immigration status.
          </p>
          <p>
            Choose to be shown only agencies and programs for which the profile
            is complete or be shown all agencies and programs regardless of the
            profile status.
          </p>
          <strong>Walk In Hours Available (program)</strong>
          <p>View only programs/agencies that have walk in hours available</p>
          <strong>Program Languages (program)</strong>
          <p>
            Select from the languages available for any given program,
            including: any (default), multi-lingual, English, Spanish or Spanish
            Creole, Vietnamese, Chinese, Arabic, Cambodian, French, French
            Creole, German, Greek, Gujarati, Hebrew, Hindi, Hungarian, Italian,
            Japanese, Korean, Mon-Khmer, Perisan, Polish, Portuguese, Russian,
            Serbo-Croation, Tagalog, Thai and Urdu. You can select several
            languages at the same time and only programs with one or more of the
            selected languages available will be displayed.
          </p>
          <strong>ADA Accessible (agency)</strong>
          <p>Only view programs and agencies that are ADA accessible.</p>
          <h3 id="navigating_results">Navigating results</h3>
          <p>
            On the results page, the first ten results that match your search
            criteria will be displayed. Load the next set by scrolling to the
            end of the page. Each result will be presented in a box containing
            the following information:
          </p>
          <ul className={classes.circlesUL}>
            <li>
              <strong>Agency name:</strong> Links to the agency details page.
            </li>
            <li>
              <strong>Agency address:</strong> Opens a map in a new tab.
            </li>
            <li>
              <strong>Agency website:</strong> Opens the agency website in a new
              tab.
            </li>
            <li>
              <strong>
                A list of all the agency programs that match your criteria.
                Displayed for each program:
              </strong>
              <ul>
                <li>
                  <strong>Program name:</strong> Links to the program details
                  page.
                </li>
                <li>
                  <strong>Program description:</strong> A brief description of
                  the program
                </li>
                <li>
                  <strong>Program phone:</strong> Click to call.
                </li>
              </ul>
            </li>
          </ul>
          <h2 id="editing_services">Editing a Service</h2>
          <h3 id="adding_agencies_programs">
            Adding new agencies and programs
          </h3>
          <h4 id="add_agency">Add new agency</h4>
          <p>
            Clicking{" "}
            <a href="/editor" target="_blank" rel="noopener noreferrer">
              ‘Add Agency’
            </a>{" "}
            will take you to a form to add information about the agency being
            created. Required fields are marked with an asterisk (*). At the
            bottom of the page you will be asked for your name and email -- the
            email is required to submit a new agency so HILSC staff or partners
            can follow up with questions Once all required fields have been
            completed, click ‘Save’ and the new addition will be sent to a
            queue. The information submitted will be reviewed and approved (or
            rejected) by site administrators.
          </p>
          <h4 id="add_program">Add new program</h4>
          <p>
            Since programs are operated by agencies, the first step to{" "}
            <a href="/editor" target="_blank" rel="noopener noreferrer">
              add a new program
            </a>{" "}
            is selecting which agency runs it. Type into the ‘Search Agency’ box
            and click the desired agency from the dropdown options. This will
            take you to a form to provide information for the program being
            created. Required fields are marked with an asterisk (*). At the
            bottom of the page you will be asked for your name and email -- the
            email is required to be able to submit a new program so HILSC staff
            or partners can follow up with questions.Once required fields have
            been completed, click ‘Save’ and the new program will be sent to a
            queue. The information submitted will be reviewed and approved (or
            rejected) by site administrators.
          </p>
          <h3 id="edit_agencies_programs">Editing agencies and programs</h3>
          <h4 id="edit_agency">Edit Agency</h4>
          <p>
            From the{" "}
            <a href="/" target="_blank" rel="noopener noreferrer">
              homepage
            </a>
            , search for the agency you would like to edit. From the search
            results page, click through to the agency details. Here you will see
            all the information available for that agency By default, only
            fields containing information are shown. If you are interested in
            seeing fields for which there is no existing information, click the
            ‘Show missing data’ toggle in the upper right corner of the page.
          </p>
          <p>
            At the bottom of the agency details page is a list of all the agency
            programs. You can click the program name to go to the program’s
            detail page or click ‘Add program’ to add a program not yet in the
            database.
          </p>
          <p>
            To edit the agency, click ‘Help Complete This Profile’ in the upper
            right corner. You will be taken to a form where you can edit agency
            information. Required fields are marked with an asterisk (*). At the
            bottom of the page you will be asked for your name and email -- the
            email is required to submit changes so HILSC staff or partners can
            follow up with questions.. Once all required fields have been
            completed, click ‘Save’ and the edits will be sent to a queue where
            the information will be reviewed and approved (or rejected) by site
            administrators
          </p>
          <p>
            To delete an agency, just click ‘Delete’ at the bottom of the agency
            editor page and your request for deletion will be sent to the queue
            for site administrators to review. <strong>Note: </strong>
            <i>Deleting an agency deletes all agency programs too.</i>
          </p>
          <h4 id="edit_program">Edit Program</h4>
          <p>
            To edit a program, first find the agency the program belongs to by
            using the search functionality available in the{" "}
            <a href="/editor" target="_blank" rel="noopener noreferrer">
              editor homepage
            </a>
          </p>
          <p>
            Another way to get to the program you want to edit is from the{" "}
            <a href="/" target="_blank" rel="noopener noreferrer">
              homepage
            </a>
            . There you can search for the program you would like to edit by
            name in the search box, or search for the agency that provides the
            program. From the search results page, click through to the program
            details page. Here you will see all the information available for
            that program. By default, only fields containing information are
            shown. If you are interested in seeing all the fields for which
            there is no existing information, click the ‘Show missing data’
            toggle in the upper right corner of the page.
          </p>
          <p>
            To edit the program, click ‘Help Complete This Profile’ in the upper
            right corner. You will be taken to a form to edit program
            information. Required fields are marked with an asterisk (*). At the
            bottom of the page you will be asked by your name and email -- email
            is required to submit program edits so that site administrators can
            follow up with you with questions. . Once all required fields have
            been completed, click ‘Save’ and your edits will be sent to a queue
            where the information submitted will be reviewed and approved (or
            rejected) by site administrators.
          </p>
          <p>
            To delete a program, click ‘Delete’ at the bottom of the page and
            your request for deletion will be sent to the queue for site
            administrators to review.
          </p>
          <h2 id="emergency_mode">Emergency Mode</h2>
          <p>
            Emergency Mode is activated during an emergency in the Houston
            region that impacts a large portion of the population, such as
            flooding during Tropical Storm Imelda or Hurricane Harvey. When
            AccessHOU is in Emergency Mode, a yellow banner will appear at the
            top of all pages with a message.{" "}
          </p>
          <p>
            When Emergency Mode is activated, all agency and program additions
            and edits will be immediately reflected in the database, so
            administrators don’t slow the availability of information. As such,
            there will be no quality control so information may or may not be
            accurate.
          </p>
          <p>
            Once Emergency Mode is disabled, all information added while it was
            employed will be moved the the queue for administrators to review.
            This will allow HILSC partners to delete services available only
            during the emergency, and approve information that is accurate for
            longer-term recovery
          </p>
          <h2 id="iiap">Informs Immigrant Accessibility Profile.</h2>
          <p>
            A program is considered an "Informs Immigrant Accessibility Profile." if this information is provided: {" "}
          </p>
          <ol>
            <li>Agency
              <ul>
                <li>IDs accepted -- current</li>
                <li>IDs accepted -- expired</li>
                <li>Proof of address</li>
                <li>Website Languages</li>
                <li>Interpretation Available</li>
                <li>Assistance to fill out intake forms</li>
                <li>Visual aids for low-literacy clients</li>
                <li>Policy for response to Immigrations and Customs Enforcement requests</li>
                <li>Staff cultural competency/effectiveness training</li>
              </ul>
            </li>
            <li>Program
              <ul>
                <li>Languages</li>
                <li>Immigration status(es)</li>
                <li>Services available same day as intake</li>
                <li>Schedule</li>
                <li>Client consult before completing paperwork</li>
              </ul>
            </li>
          </ol>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <hr/>
        </Grid>
      </Grid>
    </Container>
  );
};
