
    
    <?php $current = 'places'; ?>
    <?php require('partials/feed_head.php'); ?>

    <ul class="item-list">

        <?php require('partials/place_feed_item.php'); ?>
        <?php require('partials/place_feed_item.php'); ?>
        <?php require('partials/place_feed_item.php'); ?>

    </ul>
    
    <footer class="sorting">
      <ul>
        <li>Soon</li>
        <li class="selected">Popular</li>
        <li>Close</li>
      </ul>
    </footer>

<?php require('partials/footer.php'); ?>