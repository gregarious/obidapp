

Feature: Map mode for Object feeds
    In order to browse Objects based on location
    Users of the app
    Should be able to view and click markers on a map to see basic information

    Scenario: Click a Place marker to see its basic information in an infowindow
        Given the user is viewing the Places map
        And there is a geolocated Place named 'Best Bar'
        When the user clicks its map marker
        Then an infowindow appears showing this information about the Place named 'Best Bar':
            | name     | address         | category | image       |
            | Best Bar | 123 Perfect Ave | Food     | bestbar.jpg |


    Scenario: Click a Special marker to see its basic information in an infowindow
        Given the user is viewing the Specials map
        And there is a Special named '3 Free Beers' offered by the geolocated place 'Best Bar'
        When the user clicks its map marker
        Then an infowindow appears, showing this information:
            | special name | place name  | expires          | image       |
            | 3 Free Beers | Best Bar    | 2012-09-12 12:00 | bestbar.jpg |


    Scenario: Click an Event marker to see its basic information in an infowindow
        Given the user is viewing the Events map
        And the date is 2012-07-18 12:00
        And there an Event with a geolocated Place
            | name        | date             | place    |
            | Great Event | 2012-07-19 20:00 | Best Bar |
        When the user clicks its map marker
        Then an infowindow appears showing this information:
            | name        | location name  | date             | category | image       |
            | Great Event | Best Bar       | 2012-07-19 12:00 | Festival | greatevent.jpg |


    Scenario: Expired Events are not displayed on map
        Given today's date is 2012-07-18 14:00
        And there is an Event
            | name        | date             |
            | Great Event | 2012-07-18 12:00 |

        When the user views the Events map
        Then the marker for that Event is not displayed


    Scenario: Expired Specials are not displayed on map
        Given today's date is 2012-07-17 12:00
        And there is a Special
            | title              | expires          |
            | 10% off Everything | 2012-07-17 12:00 |

        When the user views the Specials map
        Then the marker for that Special is not displayed


    Scenario: A Special’s map marker is shown at its Place’s geolocation
        Given there is a Special
            | title              | place name      |
            | 10% off Everything | Dave and Andy’s |

        And that Special is geolocated
        When the user views the Specials map
        Then there is a marker for that Special
            

    Scenario: There are no more than 10 Place markers on the Places map
        Given a set of Places
            | name      |
            | Place 1   |
            | Place 2   |
            | Place 3   |
            | Place 4   |
            | Place 5   |
            | Place 6   |
            | Place 7   |
            | Place 8   |
            | Place 9   |
            | Place 10  |
            | Place 11  |

        When the user is viewing the Places map
        Then the map marker for the Place named 'Place 11' is not displayed


    Scenario: There are no more than 10 Event markers on the Events map
        Given a set of Events
            | name      |
            | Event 1   |
            | Event 2   |
            | Event 3   |
            | Event 4   |
            | Event 5   |
            | Event 6   |
            | Event 7   |
            | Event 8   |
            | Event 9   |
            | Event 10  |
            | Event 11  |

        When the user is viewing the Events map
        Then the map marker for the Event named 'Event 11' is not displayed


    Scenario: There are no more than 10 Special markers on the Specials map
        Given a set of Specials
            | name        |
            | Special 1   |
            | Special 2   |
            | Special 3   |
            | Special 4   |
            | Special 5   |
            | Special 6   |
            | Special 7   |
            | Special 8   |
            | Special 9   |
            | Special 10  |
            | Special 11  |

        When the user is viewing the Specials map
        Then the map marker for the Special named 'Special 11' is not displayed

            

Feature: Infowindows contain links to Object single pages
    

    Scenario: Place Infowindows link to a single Place page
        Given there is a geolocated Place with the name 'Eat Unique'
        And its infowindow is visible
        When the user clicks 'Eat Unique' in the infowindow
        Then the user is taken to a single Place page with the page title 'Eat Unique'
    

    Scenario: Event Infowindows link to a single Event page
        Given there is an Event with a geolocated Place
            | name            | date             | location       |
            | WYEP Music Fest | 2012-07-23 18:00 | Schenley Park  |

        And its infowindow is visible
        When the user clicks 'WYEP Music Fest' in the infowindow
        Then the user is taken to the single Event page with the page title 'WYEP Music Fest'


    Scenario: Special Infowindows link to a single Special page
        Given there is a Special named '3 Beers Free' offered by a geolocated Place
        And its infowindow is visible
        When the user clicks '3 Beers Free' in the infowindow
        Then the user is taken to the single Special page with the page title '3 Beers Free'


