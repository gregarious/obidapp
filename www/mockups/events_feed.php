
    
    <?php $current = 'events'; ?>
    <?php require('partials/feed_head.php'); ?>

    <ul class="item-list">

        <?php require('partials/event_feed_item.php'); ?>
        <?php require('partials/event_feed_item.php'); ?>
        <?php require('partials/event_feed_item.php'); ?>

    </ul>
    
    <footer class="sorting">
      <ul>
        <li>Soon</li>
        <li class="selected">Popular</li>
        <li>Close</li>
      </ul>
    </footer>

  <?php require('partials/footer.php');