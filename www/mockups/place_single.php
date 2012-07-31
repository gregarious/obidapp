<?php 
$feed_page="places";
require('partials/single_head.php'); ?>
    	<!-- Each of the following 3 sections is hidden/shown based on the active .single-place-nav link -->
		<header class="single-header">

    		<div class="item-thumb">
	      		<img src="https://lh6.googleusercontent.com/-lyccgEbCDf4/TymnvcO73fI/AAAAAAAAAXo/OVJYm97nzD0/w132-h132-n/slides-SS-beehive.jpg" />
	        	<div class="item-action">
	          	Add to Favorites
	        	</div>
        	</div>

	        <article class="item-content">
	            <h1 class="item-title">Place name</h1>
	            <ul class="item-details">
	                <li>Address</li>
	                <li>         
	                    <!-- Loop through tags here -->
	                    <ul class="category">
	                        <li>food</li>
	                        <li>pizza</li>
	                        <li>beer</li>
	                        <li>tennis</li>
	                    </ul>
	                </li>
	            </ul> <!-- .item-details -->
	        </article> <!-- .item-content -->

    	</header> <!-- .single-header -->	

    	<nav class="single-place-nav">
			<ul>
				<li class="selected">Info</li>
				<li>Events</li>
				<li>Specials</li>
			</ul>
		</nav> 

		<section class="single-content">

	        <article class="place-info">

				<ul class="item-details">
					<li><span class="detail-title">Hours:</span> Mon-Fri 10am - 5pm &#149; Sat 10am - 2pm &#149; Sun Closed</li>
					<li><span class="detail-title">Parking:</span> Lot, Street, Garage</li>
					<li><a href="http://coolwebsite.com">Website</a></li>
				</ul>

	        	<nav class="action-list">
	        		<ul>
	        			<li>Call</li>
	        			<li>Favorite</li>
	        			<li>Map</li>
	        		</ul>
	        	</nav>

		    	<div id="placeMapCanvas">
					<!-- Map png here: -->
					<img src="http://2d-code.co.uk/images/qr-map.jpg" />
					<h1 class="single-title">Direction</h1>
				</div>
				<p>
				Minim kale chips terry richardson, delectus photo booth scenester yr chambray quinoa Austin nulla. Synth occaecat put a bird on it mumblecore veniam. Nisi non mlkshk etsy. Whatever deserunt lomo, lo-fi gastropub craft beer direct trade. Assumenda ennui accusamus carles. Enim you probably haven't heard of them odio, cray brooklyn fugiat street art next level single-origin coffee put a bird on it iphone stumptown brunch banksy. Irure viral sustainable, messenger bag post-ironic street art ullamco cupidatat consectetur.
				</p>

				<div class="social">
		            <img src="../img/icons/facebook.png" />
		            <img src="../img/icons/twitter.png" />
		        </div>

	        </article> <!-- .place-info -->

	        <article class="place-events">

	        	<ul class="feed">

		            <li>
		                <div class="item-thumb">
		                	<img src="http://compass-style.org/images/sites/dailymile.jpg" />
		                </div>
		                <article class="item-content">
		                 	<h1 class="item-title"><a href="http://localhost/obidapp/www/mockups/place_single.template.html">Event name</a></h1>
		                 	<ul class="item-details">
		                    	<li>Starts - ends</li>
		                    	<li>organizer if there is one</li>
		                    	<li>
			                      	<!-- Loop through tags here -->
			                    	<ul class="category">
			                      		<li>food</li>
			                      		<li>pizza</li>
			                      		<li>beer</li>
			                      		<li>tennis</li>
			                    	</ul>
		                        </li>
	                  		</ul> <!-- .item-details -->
	                	</article>
	              	</li>

				</ul>

	        </article> <!-- .place-events -->

	        <article class="place-specials">

				<ul class="feed">
	        		
		            <li>
		                <div class="item-thumb">
		                	<img src="http://compass-style.org/images/sites/dailymile.jpg" />
		                </div>
		                <section class="item-content">
		                 	<h1 class="item-title"><a href="http://localhost/obidapp/www/mockups/place_single.template.html">Special title</a></h1>
		                 	<ul class="item-details">
		                    	<li>expires date</li>
		                    	<li># available</li>
		                    	<li>
			                      	<!-- Loop through tags here -->
			                    	<ul class="category">
			                      		<li>food</li>
			                      		<li>pizza</li>
			                      		<li>beer</li>
			                      		<li>tennis</li>
			                    	</ul>
		                        </li>
	                  		</ul> <!-- .item-details -->
	                	</section>
	              	</li>

				</ul>

	        </article> <!-- .place-specials -->
	       </section> <!-- .single-content -->
        
    </div> <!-- #content-view -->

    <footer id="settings-drawer" style="display:none">
        Settings
    </footer> <!-- #settings-drawer -->

</div> <!-- #main-view -->

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="../js/script.js" type="text/javascript"></script>
</body>
</html>