Feature: Filter Events by Category
	In order to make the Events feed more customized to user needs
    Users of the app looking for a specific type of Event
    Should have the option to view only Events of a specific Category

    Scenario: User clicks the Category button on the Events feed page
    	Given a user is viewing the Events feed with an Event named 'Liquor Fest' with the start date 2012-10-12 14:00 and end date 2012-10-12 18:00, and an Event named 'Make your own Undies' with the start date 2012-10-12 12:00 and end date 2012-10-12 14:00
        And there is a button with the name Category at the bottom of the page
        When the user clicks the button named Category button at the bottom of the page
        Then the user sees a menu with the following options: 'Music', 'Arts', 'Lectures', 'Festivals', 'Food', 'Community', 'General Fun', 'All'

	Scenario:
		