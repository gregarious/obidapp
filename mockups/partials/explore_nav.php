<nav id="feed-nav">
  	<ul>

		<?php 

      	if($current == 'now') {
			echo '<span class="menu-item-wrap"><li id="nav-now" class="selected"><div>Now</div></li></span>';
  		} else {
  			echo '<a href="index.php" class="menu-item-wrap"><li id="nav-now"><div>NOW</div></li></a>';	
  		} ?>      


		<?php 

      	if($current == 'places') {
			echo '<span class="menu-item-wrap"><li id="nav-places" class="selected"><div>Places</div></li></span>';
  		} else {
  			echo '<a href="places_feed.php" class="menu-item-wrap"><li id="nav-places"><div>Places</div></li></a>';	
  		} ?>      


    <?php 

      	if($current == 'events') {
			echo '<span class="menu-item-wrap"><li id="nav-events" class="selected"><div>Events</div></li></span>';
  		} else {
  			echo '<a href="events_feed.php" class="menu-item-wrap"><li id="nav-events"><div>Events</div></li></a>';	
  		} ?>


		<?php

		if($current == 'specials') {
			echo '<span class="menu-item-wrap"><li id="nav-specials" class="selected"><div>Specials</div></li></span>';
  		} else {
  			echo '<a href="specials_feed.php" class="menu-item-wrap"><li id="nav-specials"><div>Specials</div></li></a>';	
  		} ?>


		<?php

		if($current == 'news') {
			echo '<span class="menu-item-wrap"><li id="nav-news" class="selected"><div>News</div></li></span>';
  		} else {
  			echo '<a href="news_feed.php" class="menu-item-wrap"><li id="nav-news"><div>News</div></li></a>';	
  		} ?>
  		
  	</ul>
</nav> <!-- #site-nav -->