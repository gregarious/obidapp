

Feature: Single Place pages provide detailed information that Place and associated Objects
    In order to see detailed information about a Place
    Users of the app
    Should be able to view a page specific to a Place that displays information about that Place and its associate Events and Specials


    Scenario: Single Place pages have an 'About' section with detailed information
        Given the user is viewing the single page for a Place
            | name            | address    | Hours                          | Description                               
            | Johnny's Tavern | 242 Atwood | Mon-Sat 12:00-2:00, Sun Closed | Johnny's Tavern is the best in the world!

            | facebook ID | website                     | category | image       |
            | 12333221    | http://johnnystavernpgh.com | Food     | johnnys.jpg |

        When the user opens the page
            Or the user clicks the 'About' tab
        Then the user sees that information in the 'About' section


    Scenario: Single Place pages show a list of its Events
        Given the user is viewing the single page for a Place
            | name            | address    |
            | Johnny's Tavern | 242 Atwood | 
        
        And it hosts the Events
            | name           | date             | category |
            | Drinking Event | 2012-07-20 20:00 | Festival |
            | Dinner Time    | 2012-07-30 18:00 | Food     |

        When the user clicks the tab labeled 'Events'
        Then the user sees a list of those events


    Scenario: Single Place pages show a list of its Specials
        Given the user is viewing the single page for a Place
            | name            | address    |
            | Johnny's Tavern | 242 Atwood |

        And it offers the Specials
            | title                              | expires          |
            | Free Burger with purchase of Fries | 2012-07-23 12:00 |
        
        When the user clicks the tab labeled 'Coupons'
        Then the user sees that Special


Feature: Single Object pages have a mini map
    In order to get directions to a particular Place
    Users of the app
    Should be able to view a mini map on single pages that show the Place's map marker and links to directions


    Scenario: Single Place pages have a mini map with a marker linking to directions
        Given the user is viewing the single page page for a geolocated Place
            | name       | address        |
            | Jaggerbush | 2 Shepherd Ave |

        When the user clicks the mini map
        Then the user is taken to the Google Maps app and the geolocation for that Place populates the directions destination field


    Scenario: Single Event pages have a mini map with a marker linking to directions to that Event's location
        Given the user is viewing the single page for an Event with a geolocated Place
            | name         | date             | place name | place address  |
            | Trivia Night | 2012-07-20 22:00 | Jaggerbush | 2 Shepherd Ave |

        When the user clicks the mini map
        Then the user is taken to the Google Maps app and the geolocation for that Event's Place populates the directions destination field


    Scenario: Single Special pages have a mini map with a marker linking to directions to that Special's Place
        Given the user is viewing the single page for a Special at a geolocated Place
            | title       | expires          | Place name | Place address  |
            | $.10 Wings  | 2012-07-20 12:00 | Jaggerbush | 2 Shepherd Ave |

        When the user clicks the mini map
        Then the user is taken to the Google Maps app and the geolocation for that Special's Place populates the directions destination field




