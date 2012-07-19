Feature: Navigate to single Object pages
    In order to see more detailed information about an Object
    Users of the app
    Should be able to navigate to an Object’s single page

Scenario: A Place feed item links to its single Place page
        Given the user is viewing the Places feed page in list mode
        And there is a Place named “Good Burgers”
        When the user clicks its feed item
        Then the user is taken to the single Place page for the Place named “Good Burgers”

    Scenario: A Special feed item links to its single Special page
        Given the user is viewing the Specials feed page in list mode
        And there is a Special named “3 Burgers for 1”
        When the user clicks its feed item
        Then the user is taken to the single Special page for the Special named “3 Burgers for 1”

    Scenario: An Event feed item links to its single Event page
        Given the user is viewing the Events feed page in list mode
        And there is an Event named “Party on Fifth Ave”
        When the user clicks its feed item
        Then the user is taken to the single Event page for the event named “Party on Fifth Ave”

Scenario: Place Infowindows link to a single Place page
        Given there is a geolocated Place with the name “Coolest Place”
        And its infowindow is visible
        When the user clicks “Coolest Place” in the infowindow
        Then the user is taken to the single Place page for the Place named “Coolest Place”

Scenario: Event Infowindows link to a single Event page

    Given there is a geolocated Event with the date July 21, 2012 and named “Library Opening”

    And its infowindow is visible

    When the user clicks “Library Opening” in the infowindow

    Then the user is taken to the single Event page for the Event named “Library Opening”

Scenario: Special Infowindows link to a single Special page

    Given there is a geolocated Special named “Excellent Deal”

    And its infowindow is visible

    When the user clicks “Excellent Deal” in the infowindow

    Then the user is taken to the single Special page for the Special named “Excellent Deal”