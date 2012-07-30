
<nav id="feed-nav">
  	<ul>

		<?php 

      	if($current == 'now') {
			echo '<span class="menu-item-wrap"><li id="now" class="selected"><div>Now</div></li></span>';
  		} else {
  			echo '<a href="now.php" class="menu-item-wrap"><li id="now"><div>NOW</div></li></a>';	
  		} ?>      


		<?php 

      	if($current == 'places') {
			echo '<span class="menu-item-wrap"><li id="places" class="selected"><div>Places</div></li></span>';
  		} else {
  			echo '<a href="places_feed.php" class="menu-item-wrap"><li id="places"><div>Places</div></li></a>';	
  		} ?>      


      	<?php 

      	if($current == 'events') {
			echo '<span class="menu-item-wrap"><li id="events" class="selected"><div>Events</div></li></span>';
  		} else {
  			echo '<a href="events_feed.php" class="menu-item-wrap"><li id="events"><div>Events</div></li></a>';	
  		} ?>


		<?php

		if($current == 'specials') {
			echo '<span class="menu-item-wrap"><li id="specials" class="selected"><div>Specials</div></li></span>';
  		} else {
  			echo '<a href="specials_feed.php" class="menu-item-wrap"><li id="specials"><div>Specials</div></li></a>';	
  		} ?>
  		
  	</ul>
</nav> <!-- #site-nav -->
