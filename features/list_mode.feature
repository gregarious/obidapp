Feature: List mode for Object feeds

In order to browse Objects easily

Users of the app

Should be able to view Objects’ basic information in a list view

# This one might be bad

    Scenario: The Places feed defaults to list mode

        Given there is a link to the Places feed in the main menu with the href “#places”

        When the user clicks that menu item

        Then the user is taken to the Places feed page in list mode
