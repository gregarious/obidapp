

Feature: Users can favorite a Place
	In order for a user to remember a particular Place and to measure a Place's popularity
	Users of the app interested in a Place
	Should be able to favorite a Place and view it later


	Scenario: User successfully favorites a Place
		Given the user is viewing the single page of a Place
			| name 			 | address 		 |
			| Papa Davinci's | 24 Cool Blvd. |

		When the user clicks 'Add to Favorites'
		And that Place is successfully added to their favorites
		Then the button text becomes 'Remove from Favorites'

	
	Scenario: User unsuccessfully favorites a Place
		Given the user is viewing the single page of a Place
			| name 			 | address 		 |
			| Papa Davinci's | 24 Cool Blvd. |

		When the user clicks 'Add to Favorites'
		And that Place is not added to their favorites
		Then the text 'Add to Favorites' becomes 'Error!'

	
	Scenario: User successfully removes a Place from their favorites
		Given the user is viewing the single page of a Place
			| name 			 | address 		 |
			| Papa Davinci's | 24 Cool Blvd. |

		And that Place is in the user's favorites
		When the user clicks 'Remove from Favorites'
		And that Place is successfully removed from their favorites
		Then the text 'Remove from Favorites' becomes 'Add to Favorites'

	
	Scenario: User unsuccessfully removes a Place from their favorites
		Given the user is viewing the single page of a Place
			| name 			 | address 		 |
			| Papa Davinci's | 24 Cool Blvd. |

		And that Place is in the user's favorites
		When the user clicks 'Remove from Favorites'
		And that Place is not removed from their favorites
		Then the text 'Remove from Favorites' becomes 'Error!'




Feature: Users can add Events to a calendar
	In order to 