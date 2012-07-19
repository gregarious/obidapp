

Feature: Users can obtain Coupons to later redeem at a Place
	In order to obtain a Special offered by a Place
	Users of the app interested in a Coupon
	Should be able to 'grab' that Coupon

	Scenario: User successfully grabs a Coupon
		Given the user is viewing the single page for a Coupon
			| title 			   | place | expires 		  |
			| Big Slurpies at 7-11 | 7-11  | 2012-09-12 12:00 |

		When the user clicks the button 'Grab it!'
		And the Coupon is successfully grabbed
		Then the user is prompted with an alert box reading 'Thanks! You can view your Coupon in your Profile page. Show it to an employee at 7-11 on your smartphone to redeem it.'
		And the button text becomes 'Got it!'

	Scenario: User unsuccessfully grabs a Coupon
		Given the user is viewing the single page for a Coupon
			| title 			   | place | expires 		  |
			| Big Slurpies at 7-11 | 7-11  | 2012-09-12 12:00 |

		When the user clicks the button 'Grab it!'
		And the Coupon is not grabbed
		Then an alert box appears with the text 'Something went wrong! Try again.'


	Scenario: User recieves a success message when a Coupon is grabbed
		Given the user is viewing the single page for a Coupon
			| title 			   | place | expires		  |
			| Big Slurpies at 7-11 | 7-11  | 2012-09-12 12:00 |
		When the user clicks the 'Grab it!' button
		And the Coupon is successfully grabbed
		

	Scenario: User can view the Coupon from their profile page
		Given the user has grabbed a Coupon
			| title 			   | place | expires		  |
			| Big Slurpies at 7-11 | 7-11  | 2012-09-12 12:00 |
		And the user is viewing the list of grabbed Coupons in their profile
		When the user clicks that Coupon's feed item
		Then the user is taken to a screen displaying that Coupon's information
