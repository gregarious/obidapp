Feature: Filter Places by Category

In order to make the Places feed more organized
    Users of the app looking for a specific type of Place
    Should have the option to view only places of a specific category

    Scenario: Places with the category Food are the only ones shown when Food is selected
        Given a user is viewing the Places page

And the Place named “The O” has the category Food

And the Place named “Maggie’s” has the category Retail
        When the user selects the category Food from the category option
        Then the Place “Maggie’s” is removed from the Places feed

   
    Scenario: Places with the category Retail are the only ones shown when Retail is selected
        Given a user is viewing the Places page

And the Place named “Maggie’s” has the category Retail

And the Place named “The O” has the category Food
        When the user selects the category Retail from the category option
        Then the Place “The O” is removed from the Places feed

    Scenario: Places with the category Services are the only ones shown when Services is selected
        Given a user is viewing the Places page

And the Place named “Car Repair” has the category Services

And the Place named “The O” has the category Food
        When the user selects the category Services from the category option
        Then the Place “The O” is removed from the Places feed
 