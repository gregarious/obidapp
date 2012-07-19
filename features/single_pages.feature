Feature: Single pages provide detailed information about an Object
    In order to see more detailed information about an Object
    Users of the app
    Should be able to view a page specific to an Object that displays all information about that Object

    Scenario: Single Place pages show a list of its Events
        Given the user is viewing the single page for a Place named “Johnny’s Tavern”
        And it hosts the Event named “Trivia Night”
        And it hosts the Event named “Supper Time”
        When the user clicks the tab labeled “Events” on “Johnny’s Tavern’s” single page
        Then the user sees a list containing basic information about the Events “Trivia Night” and “Supper Time” hosted by “Johnny’s Tavern”

    Scenario: Single Place pages show a list of its Specials
        Given the user is viewing the single page for a Place named “Johnny’s Tavern”
        And it offers the Special named “2 Shoes for a dollar”
        When the user clicks the tab labeled “Coupons” on “Johnny’s Tavern’s” single page
        Then the user sees a list containing basic information about the Special named “2 Shoes for a dollar”

    Scenario: Single Place pages have an “About” section with detailed information
        Given the user is viewing the single Place page for a Place named “Johnny’s Tavern”
        And it has the following information:

        Hours: Mon-Fri, 10-5

            Sun, Closed

        Website: http://www.johnnystavern.com

        Description: Johnny’s Tavern is the greatest Tavern
        When the user opens the page
        Then the user sees that information in the “About” section

    Scenario: Single Place pages have a mini map with a marker linking to directions
        Given the user is viewing the single Plage page for a Place named “Jaggerbush”
        And it is geolocated
        When the user clicks the mini map
        Then the user is taken to the Google Maps app and the geolocation for the place named “Jaggerbush” populates the directions destination field

    Scenario:
    Scenario:
    Scenario:




