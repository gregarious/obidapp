Feature: Filter Places by Category
    In order to make the Places feed more customized to user needs
    Users of the app looking for a specific type of Place
    Should have the option to view only places of a specific category

    Scenario: User clicks the Category button on the Places feed page
        Given a user is viewing the Places feed with a place named 'Good Beer Here' and a Place named 'Great Fries Here'
        And there is a button with the name Category at the bottom of the page
        When the user clicks the button named Category button at the bottom of the page
        Then the user sees a menu with the following options: 'Food', 'Retail', 'Services', 'All'

    Scenario: Places with the category Food are the only ones shown when Food is selected
        Given a user is viewing the Places feed with the following Places
            | name            | address         | category         |
            | Cool Restaurant | 18 Cherry St    | Food             |
            | Best Restaurant | 12 Vegetable St | Food, Retail     |
            | Best Clothing   | 2 Cherry St     | Retail           |
            | Best Services   | 12 Fruit St     | Services         |

        And the user clicks the Category button
        When the user selects the Category 'Food' from the Category menu
        Then the Places with the item title 'Best Clothing' and 'Best Services' are removed from the Feed
   
   
    Scenario: Places with the category Retail are the only ones shown when Retail is selected
        Given a user is viewing the Places feed with the following Places
            | name            | address         | category         |
            | Cool Restaurant | 18 Cherry St    | Food             |
            | Best Restaurant | 12 Vegetable St | Food, Retail     |
            | Best Clothing   | 2 Cherry St     | Retail           |
            | Best Services   | 12 Fruit St     | Services         |

        And the user clicks the Category button
        When the user selects the Category 'Retail' from the Category menu
        Then the Places with the item title 'Cool Restaurant' and 'Best Services' are removed from the Feed


    Scenario: All Category filters are removed when 'All' is selected
        Given a user is viewing there are the following Places
            | name            | address         | category         |
            | Cool Restaurant | 18 Cherry St    | Food             |
            | Best Restaurant | 12 Vegetable St | Food, Retail     |
            | Best Clothing   | 2 Cherry St     | Retail           |
            | Best Services   | 12 Fruit St     | Services         |

        And the Places with the item titles 'Best Restaurant' and 'Cool Restaurant' are displayed
        When the user selects the Category 'All' from the Category menu
        Then the Places with the item titles 'Best Clothing' and 'Best Services' are added to the feed


Feature: Filter Events by Category

    