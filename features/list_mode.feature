

Feature: List Mode for Object feeds
	In order to browse Objects easily
	As a user of the app
	I want to be able to view Objects' basic information in a list view


	Scenario: Place feed items show basic information about the Place
		Given the user is viewing the Places page in List Mode
		When there is a Place named 'Marty's Market' with the following information
			| name 			 | address 		| category | image 		|
			| Marty's Market | 123 Penn Ave | Food 	   | martys.jpg |
		
		Then the Place feed item with the title 'Marty's Market' includes this information:
			| name 			 | address 		| category | image 		|
			| Marty's Market | 123 Penn Ave | Food 	   | martys.jpg |


	Scenario: Event feed items show basic information about the Event
		Given the user is viewing the Events page in List Mode
		When there is a Event named 'Greek Food Fest' and dated 2012-10-12 14:00 with the following information
			| name 			  | dated 		 	 | place name 		| category | image 		|
			| Greek Food Fest | 2012-10-12 14:00 | Strip District   | Food 	   | greek.jpg  |
		
		Then the Event feed item with the title 'Greek Food Fest' includes this information:
			| name 			  | dated 		 	 | place name 		| category | image 		|
			| Greek Food Fest | 2012-10-12 14:00 | Strip District   | Food 	   | greek.jpg  |


	Scenario: Special feed items show basic information about the Special
		Given the user is viewing the Specials page in List Mode
		When there is a Special named '2 Gyros for 1' offered by the Place named 'Mike and Tony's' with the following information
			| title 		| place name 	| expires 		   | place image |
			| 2 Gyros for 1 | Mike & Tony's | 2012-12-20 12:00 | greek.jpg   |

		Then the Special feed item with the title '2 Gyros for 1' and offered by the Place named 'Mike and Tony's' includes this information:
			| title 		| place name 	| expires 		   | place image |
			| 2 Gyros for 1 | Mike & Tony's | 2012-12-20 12:00 | greek.jpg   |


	Scenario: An Place does not have an image
		Given there is a Place named 'Best Bar'
		When the Event named 'Best Bar' does not have an image
		Then the feed item titled 'Best bar' will display the image 'default-place.png'


	Scenario: An Event does not have an image
		Given there is an Event named 'Great Event' with the date 2012-07-19 12:00
		When the Event named 'Great Event' does not have an image
		Then the feed item titled 'Great Event' will display the image 'default-event.png'


	Scenario: An Event does not have an image
		Given there is a Special titled 'Excellent Deal' offered by the Place named 'Eat Unique'
		When the Place named 'Eat Unique' does not have an image
		Then the feed item titled 'Excellent Deal' will display the image 'default-special.png'


Feature: The user can navigate from Map Mode to List Mode
	In order to browse Objects in Map Mode or List Mode
	As a user of the app
	I want to navigate from Map Mode to List Mode

    Scenario: The Places page is in Map Mode and the user wants to be in List Mode
        Given the user is viewing the Places page in Map Mode
        When the user clicks the List icon in the top right corner 
        Then the map is replaced with a Places feed


    Scenario: The Events page is in Map Mode and the user wants to be in List Mode
        Given the user is viewing the Events page in Map Mode
        When the user clicks the List icon in the top right corner 
        Then the map is replaced with a Events feed


    Scenario: The Specials page is in Map Mode and the user wants to be in List Mode
        Given the user is viewing the Specials page in Map Mode
        When the user clicks the List icon in the top right corner 
        Then the map is replaced with a Specials feed



Feature: List items link to single Object pages
    In order to see more detailed information about an Object
    As a user of the app
    I want to navigate to an Object’s single page its item in the list view


	Scenario: A Place feed item links to its single Place page
        Given the user is viewing the Places feed page in list mode
        And there is a Place named 'Good Burgers'
        When the user clicks the feed item with the title 'Good Burgers'
        Then the user is taken to the single page with the page title 'Good Burgers'


    Scenario: A Special feed item links to its single Special page
        Given the user is viewing the Specials feed page in list mode
        And there is a Special named '3 Burgers for 1'
        When the user clicks the feed item with the title '3 Burgers for 1'
        Then the user is taken to the single page with the title '3 Burgers for 1'


    Scenario: An Event feed item links to its single Event page
        Given the user is viewing the Events feed page in list mode
        And there is an Event named 'Party on Fifth Ave' taking place 2012-07-19 22:00
        When the user clicks the feed item titled 'Party on Fifth Ave'
        Then the user is taken to the single page with the page title 'Party on Fifth Ave'


Feature: Event lists are ordered by date
	In order to browse Events by date more easily
	As a user of the app
	I want to be able to view the date of Events immediately

	Scenario: Events are ordered by date
		Given the user is viewing the Events feed
		And there are Events named 'Coolest Event' and 'Second coolest event' with the start and end dates '2012-8-12 14:00'-'2012-8-12 17:00' and '2012-10-12 14:00'-'2012-10-12 17:00' respectively
		Then the event named 'Coolest Event' will appear before 'Second Coolest Event'
	
	# If there is time for this:
	Scenario: Events are divided into days
		Given the user is viewing the Events feed
		And there are Events named 'Coolest Event' and 'Second coolest event' with the start and end dates '2012-8-12 14:00'-'2012-8-12 17:00' and '2012-10-12 14:00'-'2012-10-12 17:00' respectively
		Then 'Coolest Event' will appear directly under the banner 'Sunday 2012-8-12'