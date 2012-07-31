<?php $current = 'now'; ?>
<?php require('partials/feed_head.php'); ?>

<section class="page-now">
    <h1 class="welcome-msg">Welcome to the Oakland Scene!</h1>
    <h2>So, what's this all about?</h2>
    <article class="about">
        
        <p>Oakland has it's own app! Wha whaaaa>? Yep, Oakland is the first Pennsylvania neighborhood to have its own app. How crazy that its us! We are always open to feedback, so if you spot any bugs or have ideas for improvements, tweet at us or find us on facebook. Thnx n luv alwayz!</p>
    </article>

    <h2 class="featured">Featured:</h2>
    <ul class="item-list">
        <?php require('partials/place_feed_item.php'); ?>
    </ul>
</section>

<?php require('partials/footer.php'); ?>